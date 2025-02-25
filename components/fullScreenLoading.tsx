"use client"

import { useMaterialLayout } from "@/contexts/LayoutContext";
import Loader from "./loader";

export default function FullScreenLoading() {
  const { isLoading } = useMaterialLayout()
  return (
    <>
      {isLoading && (
        <div className="fixed z-50 h-full inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded text-black">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
}
