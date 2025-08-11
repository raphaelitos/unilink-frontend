import Image from "next/image"

interface PostMediaProps {
  imageUrl: string
}

export function PostMedia({ imageUrl }: PostMediaProps) {
  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-muted">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt="Post media"
        fill
        className="object-cover"
        sizes="(max-width: 700px) 100vw, 700px"
      />
    </div>
  )
}
