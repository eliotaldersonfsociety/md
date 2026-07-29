"use client"

import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
      <div className="relative aspect-[3/4] bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-2.5 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}
