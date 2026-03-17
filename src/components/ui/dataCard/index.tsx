import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<CardProps>
  Body: React.FC<CardProps>
  Footer: React.FC<CardProps>
}

const Card: CardComponent = ({ children, className, onClick }) => {
  return (
    <div className={cn('rounded-lg shadow-md bg-[#343A40]', className)} onClick={onClick}>
      {children}
    </div>
  )
}

const Header: React.FC<CardProps> = ({ children, className }) => {
  return <div className={cn('p-4 border-b border-[#252A30]', className)}>{children}</div>
}

const Body: React.FC<CardProps> = ({ children, className }) => {
  return <div className={cn('p-4', className)}>{children}</div>
}

const Footer: React.FC<CardProps> = ({ children, className }) => {
  return <div className={cn('p-4 border-t border-[#252A30]', className)}>{children}</div>
}

Card.Header = Header
Card.Body = Body
Card.Footer = Footer

export default Card
