import Link from 'next/link'

export default function CourseButton() {
  return (
    <Link
      className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
      href="/course"
    >
      COURSE PAGE BETA
    </Link>
  )
}
