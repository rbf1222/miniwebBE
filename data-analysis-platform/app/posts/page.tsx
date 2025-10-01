"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AppLayout } from "@/components/layouts/app-layout"
import { PostCard } from "@/components/posts/post-card"
import { PostTableView } from "@/components/posts/post-table-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Search, Grid, List, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
interface Post {
  id: string;
  title: string;
  username: string;
  created_at: string;
  translatedTitle?: string;
}

interface PostsPageProps {
  language: string;
}

export default function PostsPage({ language: initialLanguage }: PostsPageProps) {

  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState(initialLanguage || 'ko');

  console.log("받은 language props:", language);

  const { t, i18n, ready } = useTranslation()

  // 서버에서 게시물 데이터를 불러오는 부분입니다.
  useEffect(() => {

    setIsLoading(true)
    fetch("http://192.168.0.165:5000/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load posts")
        return res.json()
      })
      .then((data: Post[]) => {
        setPosts(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  //i18n language 실행
  useEffect(() => {
    if (i18n && typeof i18n.changeLanguage === "function" && ready) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n, ready]);

  // 언어 바뀔 때 번역 실행
  useEffect(() => {
    if (!posts.length) return;
    let isMounted = true;

    async function translateText(texts: string[], targetLang: string) {
      const res = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts, targetLang }),
      })
      const data = await res.json()
      console.log("백엔드 번역 API 응답:", data)
      return data.translations
    }


    async function translateAll() {
      const texts = posts.map((post) => {
        return post.title
      })
      const result = await translateText(texts, language);
      result.map((title: string, idx: number) => {
        const newPosts = [...posts];
        newPosts[idx].title = title;
        setPosts(newPosts);
      })

      // const translatedPosts = await Promise.all(

      //   // posts.map(async (post) => {
      //   //   const translatedTitle = await translateText(post.title, language)
      //   //   return { ...post, translatedTitle }
      //   // })
      // )
      // if (isMounted) setPosts(translatedPosts)
    }


    translateAll()

    return () => { isMounted = false } // cleanup
  }, [posts.length, language])


  // 검색어와 정렬 순서에 따라 게시물을 필터링하고 정렬합니다.
  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredPosts(filtered)
  }, [posts, searchTerm, sortBy])


  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout onChange={() => { }}>
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AppLayout onChange={(translatedText) => {
        setLanguage(translatedText);
      }}>
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">{t("posts")}</h1>
            <p className="text-muted-foreground">{t("checkUploadedData")}</p>
          </div>

          {/* Controls */}
          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchByTitleOrAuthor")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "title") => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("sortNewest")}</SelectItem>
                  <SelectItem value="oldest">{t("sortOldest")}</SelectItem>
                  <SelectItem value="title">{t("sortByTitle")}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 게시물이 없을 때 표시되는 부분 */}
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">{searchTerm ? t("noSearchResults") : t("noPosts")}</CardTitle>
                <CardDescription>
                  {searchTerm ? t("tryAnotherKeyword") : t("adminUploadNotice")}
                </CardDescription>
              </CardContent>
            </Card>
          ) : viewMode === "card" ? (
            // 카드 뷰
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            // 테이블 뷰
            <PostTableView posts={filteredPosts} />
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
