import React from "react"

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Header</h1>
      {children}
    </div>
  )
}
