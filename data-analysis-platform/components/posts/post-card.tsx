import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "react-i18next";

interface Post {
  id: string;
  title: string;
  username:string;
  created_at: string;
  translatedTitle?: string;
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  // 날짜 문자열을 처리하는 함수를 개선하여 'Invalid Date' 오류를 방지합니다.
  const formatDate = (dateString: string) => {
    // 유효한 날짜 문자열인지 확인
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return t("noDate"); // 유효하지 않은 경우 대체 텍스트 반환
    }

    

    // 유효한 경우, 'YYYY년 M월 D일' 형식으로 포맷
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
     return `${year}${t("year")} ${month}${t("month")} ${day}${t("day")} ${hour}${t("hour")} ${min}${t("minute")}`;
  };

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{post.translatedTitle || post.title}</CardTitle>
            </div>
          </div>
          <CardDescription className="flex items-center gap-4 text-sm mt-2">
            {/* 작성자 정보 */}
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{post.username}</span>
            </div>
            {/* 게시 날짜 정보 */}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}