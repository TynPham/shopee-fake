import * as React from 'react'
import CartHeader from 'src/components/cartHeader.tsx'
import Footer from 'src/components/footer'

export interface CartLayoutProps {
  children: React.ReactNode
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}
