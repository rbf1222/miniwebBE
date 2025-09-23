"use client"

import { useState, useEffect } from "react"
import PageTitle from "../components/PageTitle.jsx"
import Section from "../components/Section.jsx"
import Card from "../components/Card.jsx"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { getPosts } from "../lib/api.js"
import { showToast } from "../components/ToastHost.jsx"

export default function AdminDashboard({ navigate }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await getPosts()
      setPosts(response)
    } catch (error) {
      showToast(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const refreshPosts = () => {
    fetchPosts()
  }

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 space-y-8">
      <PageTitle>관리자 대시보드</PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <Section title="빠른 작업">
            <div className="space-y-4">
              <Button onClick={() => navigate("adminPostNew")} className="w-full">
                새 게시물 작성
              </Button>
              <Button variant="outline" onClick={() => navigate("postsList")} className="w-full bg-transparent">
                게시물 목록 보기
              </Button>
            </div>
          </Section>
        </Card>

        {/* Recent Posts */}
        <Card>
          <Section title="최근 게시물 (5개)">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-sm text-slate-500">게시물이 없습니다</p>
            ) : (
              <div className="space-y-2">
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-sm">{post.title}</p>
                      <p className="text-xs text-slate-500">{formatDate(post.createdAt)}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate("postDetail", { id: post.id })}>
                      보기
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </Card>
      </div>

      {/* Recent Posts Table */}
      <Card>
        <Section title="게시물 관리">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">총 {posts.length}개의 게시물</p>
              <Button variant="outline" onClick={refreshPosts} disabled={loading}>
                {loading ? "새로고침 중..." : "새로고침"}
              </Button>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>작성자</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                        게시물이 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{formatDate(post.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate("postDetail", { id: post.id })}>
                              보기
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate("adminPostEdit", { id: post.id })}
                            >
                              수정
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Section>
      </Card>
    </div>
  )
}
