import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

const r2 = new S3Client({
	region: 'auto',
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
	},
})

export async function POST(req: NextRequest) {
	// Auth check
	const supabase = createClient(cookies())
	const { data: { user } } = await supabase.auth.getUser()
	if (!user?.email_confirmed_at) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { fileName, contentType, courseCode } = await req.json()

	if (!fileName || !contentType || !courseCode) {
		return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
	}
	const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
	if (!allowedTypes.includes(contentType)) {
		return NextResponse.json({ error: 'Only PDF and DOCX files are allowed' }, { status: 400 })
	}

	const ext = fileName.split('.').pop() ?? 'pdf'
	const key = `course-outlines/${courseCode}/${randomUUID()}.${ext}`

	const command = new PutObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME!,
		Key: key,
		ContentType: contentType,
		ContentLength: undefined,
	})

	const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 120 })
	const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`

	return NextResponse.json({ presignedUrl, publicUrl })
}
