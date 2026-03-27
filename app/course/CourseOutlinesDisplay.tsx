'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { User } from '@supabase/supabase-js'
import { X } from 'lucide-react'
import { useManageBodyScroll, usePopupManager } from '@/components/Header'
import LoginPopup from '@/components/LoginPopup'
import SignUpPopup from '@/components/SignUpPopup'
import { Outline } from './CourseOutlines'
import { insertOutline } from './outlineActions'

// ─── Helpers ────────────────────────────────────────────────────────────────

const TERM_ORDER: Record<string, number> = { Fall: 3, Spring: 2, Winter: 1 }

function termSortKey(term: string): number {
	const [season, yearStr] = term.split(' ')
	return parseInt(yearStr ?? '0', 10) * 10 + (TERM_ORDER[season] ?? 0)
}

function formatDate(dateStr: string): string {
	const date = new Date(dateStr)
	const diff = Math.floor((Date.now() - date.getTime()) / 1000)
	if (diff < 60) return 'just now'
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
	if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
	return date.toLocaleDateString('en-CA', { month: 'short', year: 'numeric' })
}

function generateTermOptions(): string[] {
	const seasons = ['Fall', 'Spring', 'Winter']
	const year = new Date().getFullYear()
	const terms: string[] = []
	for (let y = year + 1; y >= year - 2; y--) {
		for (const season of seasons) {
			terms.push(`${season} ${y}`)
		}
	}
	return terms
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function PdfIcon({ size = 20 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
			<polyline points='14 2 14 8 20 8' />
			<line x1='16' y1='13' x2='8' y2='13' />
			<line x1='16' y1='17' x2='8' y2='17' />
			<line x1='10' y1='9' x2='8' y2='9' />
		</svg>
	)
}

function DownloadIcon() {
	return (
		<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
			<polyline points='7 10 12 15 17 10' />
			<line x1='12' y1='15' x2='12' y2='3' />
		</svg>
	)
}

function ChevronRight() {
	return (
		<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<polyline points='9 18 15 12 9 6' />
		</svg>
	)
}

function UploadIcon() {
	return (
		<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
			<polyline points='17 8 12 3 7 8' />
			<line x1='12' y1='3' x2='12' y2='15' />
		</svg>
	)
}

function LockIcon() {
	return (
		<svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
			<rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
			<path d='M7 11V7a5 5 0 0 1 10 0v4' />
		</svg>
	)
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────

function PdfViewer({ outline, onClose }: { outline: Outline; onClose: () => void }) {
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose()
		}
		document.addEventListener('mousedown', handleOutside)
		return () => document.removeEventListener('mousedown', handleOutside)
	}, [onClose])

	const isMock = outline.file_url === '#'

	return (
		<div ref={modalRef} className='co-viewer'>
			<div className='co-viewer-header'>
				<div className='co-viewer-title'>
					<span className='co-viewer-icon'><PdfIcon size={16} /></span>
					<span className='co-viewer-name'>{outline.file_name}</span>
				</div>
				<div className='co-viewer-actions'>
					{!isMock && (
						<a
							href={outline.file_url}
							download
							className='co-viewer-download'
						>
							<DownloadIcon />
							Download
						</a>
					)}
					<button type='button' onClick={onClose} className='rv-close'>
						<X size={20} />
					</button>
				</div>
			</div>
			<div className='co-viewer-body'>
				{isMock ? (
					<div className='co-viewer-placeholder'>
						<PdfIcon size={36} />
						<span>PDF preview will appear here once real files are uploaded</span>
					</div>
				) : (
					<iframe
						src={outline.file_url}
						className='co-viewer-frame'
						title={outline.file_name}
					/>
				)}
			</div>
		</div>
	)
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({ onClose, courseCode }: { onClose: () => void; courseCode: string }) {
	const modalRef = useRef<HTMLDivElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [selectedTerm, setSelectedTerm] = useState(generateTermOptions()[0])
	const [dragging, setDragging] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const terms = generateTermOptions()

	useEffect(() => {
		const handleOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				if (!uploading) onClose()
			}
		}
		document.addEventListener('mousedown', handleOutside)
		return () => document.removeEventListener('mousedown', handleOutside)
	}, [onClose, uploading])

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		setDragging(true)
	}
	const handleDragLeave = () => setDragging(false)
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		setDragging(false)
		const file = e.dataTransfer.files[0]
		if (file?.type === 'application/pdf') setSelectedFile(file)
	}
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) setSelectedFile(file)
	}
	const handleSubmit = async () => {
		if (!selectedFile || uploading) return
		setUploading(true)
		setError(null)
		try {
			// 1. Get presigned URL from our API
			const res = await fetch('/api/r2-presign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fileName: selectedFile.name,
					contentType: selectedFile.type,
					courseCode,
				}),
			})
			const { presignedUrl, publicUrl, error: presignError } = await res.json()
			if (presignError || !presignedUrl) throw new Error(presignError ?? 'Failed to get upload URL')

			// 2. Upload file directly to R2
			const upload = await fetch(presignedUrl, {
				method: 'PUT',
				headers: { 'Content-Type': selectedFile.type },
				body: selectedFile,
			})
			if (!upload.ok) throw new Error('Upload to storage failed')

			// 3. Insert record into Supabase
			const { error: insertError } = await insertOutline(courseCode, publicUrl, selectedFile.name, selectedTerm)
			if (insertError) throw new Error(insertError)

			setSuccess(true)
			setTimeout(() => { onClose(); window.location.reload() }, 1600)
		} catch (err: any) {
			setError(err.message ?? 'Something went wrong')
		} finally {
			setUploading(false)
		}
	}

	return (
		<div ref={modalRef} className='co-modal'>
			<div className='co-modal-header'>
				<h2 className='co-modal-title'>Upload Course Outline</h2>
				<button onClick={onClose} type='button' className='rv-close'>
					<X size={20} />
				</button>
			</div>
			<hr className='rv-divider' />

			<div className='co-modal-body'>
				{success ? (
					<div className='co-success'>
						<div className='co-success-icon'>
							<svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
								<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
								<polyline points='22 4 12 14.01 9 11.01' />
							</svg>
						</div>
						<span className='co-success-text'>Outline uploaded — thanks for contributing!</span>
					</div>
			) : error ? (
				<div className='co-upload-error'>{error}</div>
			) : (
					<>
						<label className='rv-label'>Term</label>
						<select
							value={selectedTerm}
							onChange={e => setSelectedTerm(e.target.value)}
							className='rv-select co-modal-select'
						>
							{terms.map(t => <option key={t}>{t}</option>)}
						</select>

						<label className='rv-label' style={{ marginTop: 20 }}>Course outline (PDF, max 10 MB)</label>

						{selectedFile ? (
							<div className='co-file-badge'>
								<span className='co-file-badge-icon'><PdfIcon size={18} /></span>
								<span className='co-file-badge-name'>{selectedFile.name}</span>
								<button
									type='button'
									className='co-file-badge-remove'
									onClick={() => setSelectedFile(null)}
								>
									<X size={14} />
								</button>
							</div>
						) : (
							<div
								className={`co-dropzone${dragging ? ' co-dropzone-active' : ''}`}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={() => fileInputRef.current?.click()}
							>
								<div className='co-dropzone-icon'>
									<svg width='30' height='30' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round'>
										<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
										<polyline points='14 2 14 8 20 8' />
										<line x1='12' y1='18' x2='12' y2='12' />
										<polyline points='9 15 12 12 15 15' />
									</svg>
								</div>
								<p className='co-dropzone-text'>Drop your PDF here or <span>browse</span></p>
								<p className='co-dropzone-hint'>PDF · max 10 MB</p>
								<input
									ref={fileInputRef}
									type='file'
									accept='.pdf,application/pdf'
									style={{ display: 'none' }}
									onChange={handleFileChange}
								/>
							</div>
						)}
					</>
				)}
			</div>

			{!success && (
				<div className='co-modal-footer'>
					<button type='button' className='co-modal-cancel' onClick={onClose}>
						Cancel
					</button>
					<button
						type='button'
						className={`co-modal-submit${(!selectedFile || uploading) ? ' co-modal-submit-disabled' : ''}`}
						onClick={handleSubmit}
						disabled={!selectedFile || uploading}
					>
						{uploading ? 'Uploading…' : 'Upload'}
					</button>
				</div>
			)}
		</div>
	)
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CourseOutlinesDisplay({
	outlines,
	courseCode,
	user,
}: {
	outlines: Outline[]
	courseCode: string
	user: User | null
}) {
	const terms = [...new Set(outlines.map(o => o.term))].sort(
		(a, b) => termSortKey(b) - termSortKey(a)
	)
	const [activeTab, setActiveTab] = useState('All')
	const [showUploadModal, setShowUploadModal] = useState(false)
	const [viewingOutline, setViewingOutline] = useState<Outline | null>(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(false)
	const carouselRef = useRef<HTMLDivElement>(null)

	const updateArrows = useCallback(() => {
		const el = carouselRef.current
		if (!el) return
		setCanScrollLeft(el.scrollLeft > 4)
		setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
	}, [])

	useEffect(() => {
		const el = carouselRef.current
		if (!el) return
		updateArrows()
		el.addEventListener('scroll', updateArrows, { passive: true })
		const ro = new ResizeObserver(updateArrows)
		ro.observe(el)
		return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
	}, [updateArrows])

	// Reset carousel to start when tab changes
	useEffect(() => {
		carouselRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
	}, [activeTab])

	const scrollCarousel = (dir: 'left' | 'right') => {
		carouselRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
	}

	const {
		showLoginPopup,
		toggleLoginPopup,
		showSignUpPopup,
		toggleSignUpPopup,
		togglePasswordPopup,
	} = usePopupManager()

	useManageBodyScroll(showLoginPopup || showSignUpPopup || showUploadModal || !!viewingOutline)

	const visible = activeTab === 'All'
		? outlines
		: outlines.filter(o => o.term === activeTab)

	const canUpload = !!user?.confirmed_at

	return (
		<section className='co-section'>
			{/* Header */}
			<div className='co-header'>
				<div>
					<p className='cp-section-label'>Contributed by Students</p>
					<h2 className='cp-section-title' style={{ marginBottom: 0 }}>Course Outlines</h2>
				</div>
				{canUpload ? (
					<button
						type='button'
						className='co-upload-btn'
						onClick={() => setShowUploadModal(true)}
					>
						<UploadIcon />
						Upload Outline
					</button>
				) : !user ? (
					<button
						type='button'
						className='co-upload-btn'
						onClick={toggleLoginPopup}
					>
						<UploadIcon />
						Upload Outline
					</button>
				) : null}
			</div>

			{/* Locked state for guests */}
			{!user ? (
				<div className='co-locked'>
					<div className='co-locked-overlay'>
						<div className='co-lock-icon'><LockIcon /></div>
						<p className='co-lock-text'>
							<button type='button' className='co-lock-signin' onClick={toggleLoginPopup}>Log in</button>
							{' '}to view and upload course outlines
						</p>
					</div>
				</div>
			) : (
				<>
					{/* Term tabs */}
					{terms.length > 0 && (
						<div className='co-tabs'>
							{['All', ...terms].map(tab => (
								<button
									key={tab}
									type='button'
									onClick={() => setActiveTab(tab)}
									className={`co-tab${activeTab === tab ? ' co-tab-active' : ''}`}
								>
									{tab}
								</button>
							))}
						</div>
					)}

				{/* Outline carousel */}
				{visible.length === 0 ? (
					<p className='co-empty'>
						No outlines yet for {activeTab === 'All' ? courseCode : activeTab}.
						{canUpload && (
							<button
								type='button'
								className='co-empty-cta'
								onClick={() => setShowUploadModal(true)}
							>
								Be the first to contribute.
							</button>
						)}
					</p>
				) : (
					<div className='co-carousel-wrap'>
						{canScrollLeft && (
							<button type='button' className='co-carousel-btn co-carousel-btn-left' onClick={() => scrollCarousel('left')} aria-label='Scroll left'>
								<ChevronRight style={{ transform: 'rotate(180deg)' }} />
							</button>
						)}
						<div className='co-carousel' ref={carouselRef}>
							{visible.map(outline => (
								<div
									key={outline.id}
									className='co-card'
									onClick={() => setViewingOutline(outline)}
									role='button'
									tabIndex={0}
									onKeyDown={e => e.key === 'Enter' && setViewingOutline(outline)}
								>
									<div className='co-card-top'>
										<div className='co-card-icon'><PdfIcon size={22} /></div>
										<span className='co-card-term'>{outline.term}</span>
									</div>
									<span className='co-card-name'>{outline.file_name}</span>
									<span className='co-card-meta'>
										{outline.uploaded_by_name ?? 'Anonymous'}
										{outline.uploaded_by_program && ` · ${outline.uploaded_by_program}`}
										{' · '}{formatDate(outline.created_at)}
									</span>
								</div>
							))}
						</div>
						{canScrollRight && (
							<button type='button' className='co-carousel-btn co-carousel-btn-right' onClick={() => scrollCarousel('right')} aria-label='Scroll right'>
								<ChevronRight />
							</button>
						)}
					</div>
				)}
				</>
			)}

			{/* PDF viewer */}
			{viewingOutline && createPortal(
				<div className='hp-popup-overlay'>
					<PdfViewer
						outline={viewingOutline}
						onClose={() => setViewingOutline(null)}
					/>
				</div>,
				document.body
			)}

			{/* Upload modal */}
			{showUploadModal && createPortal(
				<div className='hp-popup-overlay'>
					<UploadModal onClose={() => setShowUploadModal(false)} courseCode={courseCode} />
				</div>,
				document.body
			)}

			{/* Auth portals */}
			{showLoginPopup && !showSignUpPopup && createPortal(
				<div className='hp-popup-overlay'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLoginPopup}
						toggleSignUp={toggleSignUpPopup}
						togglePasswordReset={togglePasswordPopup}
					/>
				</div>,
				document.body
			)}
			{showSignUpPopup && !showLoginPopup && createPortal(
				<div className='hp-popup-overlay'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>,
				document.body
			)}
		</section>
	)
}
