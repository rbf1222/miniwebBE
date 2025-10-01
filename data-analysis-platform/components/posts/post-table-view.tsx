
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useTranslation } from "react-i18next";

interface Post {
  id: string;
  title: string;
  username: string;
  created_at: string;
  translatedTitle?: string;
}

interface PostTableViewProps {
  posts: Post[]
}

export function PostTableView({ posts }: PostTableViewProps) {
  const { t, i18n } = useTranslation(); 

  const formatDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return t("noDate"); // 유효하지 않은 경우 번역된 문구 반환
    }

    return new Date(dateString).toLocaleString(i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: i18n.language === "en" // 영어만 AM/PM 표시
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("author")}</TableHead>
            <TableHead>{t("createdAt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                {t("noPosts")}
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link href={`/posts/${post.id}`} className="font-medium hover:text-primary">
                    {post.translatedTitle || post.title}
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
