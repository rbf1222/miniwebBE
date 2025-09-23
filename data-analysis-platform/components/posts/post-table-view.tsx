import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface Post {
  id: string;
  title: string;
  username:string;
  created_at: string;
}

interface PostTableViewProps {
  posts: Post[]
}

export function PostTableView({ posts }: PostTableViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>작성자</TableHead>
            <TableHead>생성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                게시물이 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link href={`/posts/${post.id}`} className="font-medium hover:text-primary">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>{post.username}</TableCell>
                <TableCell>{formatDate(post.created_at)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
