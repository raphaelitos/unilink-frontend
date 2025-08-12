import { useRouter } from "next/router"
import { Feed } from "@/components/feed/Feed"
import type { Post } from "@/types"

// Static data for posts
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    project: {
      name: "AI Research Lab",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      link: "https://ai-research-lab.university.edu",
    },
    caption:
      "Excited to announce our breakthrough in natural language processing! Our new model achieves state-of-the-art results on multiple benchmarks. This research will help advance conversational AI systems.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    createdAt: "2024-01-15T10:30:00Z",
    tags: [
      { id: "t1", text: "tecnologia", color: "#E3F2FD" },
      { id: "t2", text: "IA",         color: "#FFF3E0" },
      { id: "t3", text: "pesquisa",   color: "#E8F5E9" },
    ],
  },
  {
    id: "2",
    project: {
      name: "Sustainable Energy Initiative",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      link: "https://sustainable-energy.university.edu",
    },
    caption:
      "Our solar panel efficiency project has reached a major milestone! We've successfully increased energy conversion rates by 15% using innovative materials.",
    createdAt: "2024-01-14T14:20:00Z",
    tags: [
      { id: "t4", text: "sustentabilidade", color: "#E8F5E9" },
      { id: "t5", text: "energia",          color: "#FFFDE7" },
      { id: "t6", text: "bolsa",            color: "#F3E5F5" },
    ],
  },
  {
    id: "3",
    project: {
      name: "Digital Health Platform",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      link: "https://digital-health.university.edu",
    },
    caption:
      "Launching our new telemedicine platform next month! This will provide accessible healthcare solutions to underserved communities. Beta testing has shown promising results.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
    createdAt: "2024-01-13T09:15:00Z",
    tags: [
      { id: "t7", text: "saúde",      color: "#E3F2FD" },
      { id: "t8", text: "plataforma", color: "#F1F8E9" },
      { id: "t9", text: "voluntário", color: "#FFF8E1" },
    ],
  },
  {
    id: "4",
    project: {
      name: "Robotics Engineering Team",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      link: "https://robotics.university.edu",
    },
    caption:
      "Our autonomous navigation system won first place at the International Robotics Competition! Proud of the team's dedication and innovative approach.",
    createdAt: "2024-01-12T16:45:00Z",
    tags: [
      { id: "t10", text: "robótica",  color: "#E0F2F1" },
      { id: "t11", text: "competição", color: "#FFEBEE" },
    ],
  },
  {
    id: "5",
    project: {
      name: "Blockchain Research Group",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      link: "https://blockchain.university.edu",
    },
    caption:
      "Published our latest paper on decentralized identity systems. This research addresses privacy concerns in digital identity verification.",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    createdAt: "2024-01-11T11:30:00Z",
    tags: [
      { id: "t12", text: "blockchain", color: "#EDE7F6" },
      { id: "t13", text: "privacidade", color: "#F9FBE7" },
      { id: "t14", text: "pesquisa",    color: "#E3F2FD" },
    ],
  },
]

export default function FeedPage() {
  const router = useRouter()
  const { empty, error } = router.query

  // Simulate empty state
  if (empty === "1") {
    return <Feed posts={[]} />
  }

  // Simulate error state
  if (error === "1") {
    return <Feed posts={[]} error="Failed to load posts. Please try again later." />
  }

  return <Feed posts={MOCK_POSTS} />
}
