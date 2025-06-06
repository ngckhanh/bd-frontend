"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SortAsc, SortDesc, ExternalLink } from "lucide-react"

export default function AnalyticsTable({ analyticsData }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date")
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  // Sort function
  const sortData = (data) => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  // Request sort
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Filter data based on search term
  const filterData = (data) => {
    if (!searchTerm) return data

    return data.filter((item) => item.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  // Pagination
  const paginate = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  // Prepare data for display
  const preparePartOneData = () => {
    const filteredData = filterData(analyticsData?.part_one || [])
    const sortedData = sortData(filteredData)
    return paginate(sortedData)
  }

  const preparePartTwoData = () => {
    const filteredData = filterData(analyticsData?.part_two || [])
    const sortedData = sortData(filteredData)
    return paginate(sortedData)
  }

  // Calculate total pages
  const getTotalPages = (dataLength) => {
    return Math.ceil(dataLength / itemsPerPage)
  }

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "asc" ? <SortAsc className="h-4 w-4 ml-1" /> : <SortDesc className="h-4 w-4 ml-1" />
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo đề bài"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="10 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="part_one" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="part_one">Part 1 ({analyticsData?.part_one?.length || 0})</TabsTrigger>
          <TabsTrigger value="part_two">Part 2 & 3 ({analyticsData?.part_two?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="part_one" className="w-full">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] cursor-pointer" onClick={() => requestSort("created_at")}>
                    <div className="flex items-center">Ngày {renderSortIcon("created_at")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("topic")}>
                    <div className="flex items-center">Đề bài {renderSortIcon("topic")}</div>
                  </TableHead>
                  <TableHead className="w-[100px] text-right cursor-pointer" onClick={() => requestSort("total_mark")}>
                    <div className="flex items-center justify-end">Điểm {renderSortIcon("total_mark")}</div>
                  </TableHead>
                  <TableHead className="w-[100px] text-center">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preparePartOneData().map((item, index) => (
                  <TableRow key={`part1-${index}`}>
                    <TableCell className="font-medium">{formatDate(item.created_at)}</TableCell>
                    <TableCell>{item.topic}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${item.total_mark >= 6.5 ? "text-green-600" : item.total_mark >= 5.5 ? "text-amber-600" : "text-red-600"}`}
                      >
                        {item.total_mark.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => window.open(`/speaking/submission/${item.id || "detail"}`, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {preparePartOneData().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filterData(analyticsData?.part_one || []).length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {Math.min((currentPage - 1) * itemsPerPage + 1, filterData(analyticsData?.part_one || []).length)} to{" "}
                {Math.min(currentPage * itemsPerPage, filterData(analyticsData?.part_one || []).length)} of{" "}
                {filterData(analyticsData?.part_one || []).length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, getTotalPages(filterData(analyticsData?.part_one || []).length)),
                    )
                  }
                  disabled={currentPage === getTotalPages(filterData(analyticsData?.part_one || []).length)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="part_two" className="w-full">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] cursor-pointer" onClick={() => requestSort("created_at")}>
                    <div className="flex items-center">Date {renderSortIcon("created_at")}</div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort("topic")}>
                    <div className="flex items-center">Topic {renderSortIcon("topic")}</div>
                  </TableHead>
                  <TableHead className="w-[100px] text-right cursor-pointer" onClick={() => requestSort("total_mark")}>
                    <div className="flex items-center justify-end">Score {renderSortIcon("total_mark")}</div>
                  </TableHead>
                  <TableHead className="w-[100px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preparePartTwoData().map((item, index) => (
                  <TableRow key={`part2-${index}`}>
                    <TableCell className="font-medium">{formatDate(item.created_at)}</TableCell>
                    <TableCell>{item.topic}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${item.total_mark >= 6.5 ? "text-green-600" : item.total_mark >= 5.5 ? "text-amber-600" : "text-red-600"}`}
                      >
                        {item.total_mark.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => window.open(`/speaking/submission/${item.id || "detail"}`, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {preparePartTwoData().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filterData(analyticsData?.part_two || []).length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {Math.min((currentPage - 1) * itemsPerPage + 1, filterData(analyticsData?.part_two || []).length)} to{" "}
                {Math.min(currentPage * itemsPerPage, filterData(analyticsData?.part_two || []).length)} of{" "}
                {filterData(analyticsData?.part_two || []).length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, getTotalPages(filterData(analyticsData?.part_two || []).length)),
                    )
                  }
                  disabled={currentPage === getTotalPages(filterData(analyticsData?.part_two || []).length)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background p-3 rounded-md border">
            <div className="text-sm text-muted-foreground">Total Attempts</div>
            <div className="text-2xl font-bold">{analyticsData?.total_attempts || 0}</div>
          </div>
          <div className="bg-background p-3 rounded-md border">
            <div className="text-sm text-muted-foreground">Highest Score</div>
            <div className="text-2xl font-bold text-green-600">
              {Math.max(
                ...[...(analyticsData?.part_one || []), ...(analyticsData?.part_two || [])].map(
                  (item) => item.total_mark,
                ),
                0,
              ).toFixed(1)}
            </div>
          </div>
          <div className="bg-background p-3 rounded-md border">
            <div className="text-sm text-muted-foreground">Average Score</div>
            <div className="text-2xl font-bold text-blue-600">
              {(
                [...(analyticsData?.part_one || []), ...(analyticsData?.part_two || [])].reduce(
                  (acc, item) => acc + item.total_mark,
                  0,
                ) / Math.max([...(analyticsData?.part_one || []), ...(analyticsData?.part_two || [])].length, 1)
              ).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

