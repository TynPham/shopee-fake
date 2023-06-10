import React from 'react'
import Footer from 'src/components/footer'
import RegisterHeader from 'src/components/registerHeader'

interface RegisterLayoutProps {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}
