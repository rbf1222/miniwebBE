import * as React from 'react'
import { cn } from '@/lib/utils'

// 1. props 타입을 명확하게 하기 위해 interface로 추출합니다.
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// 2. function Input(...)을 React.forwardRef로 감싸는 구조로 변경합니다.
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
        ref={ref} // 3. 받아온 ref를 실제 <input> 요소에 전달합니다.
        {...props}
      />
    )
  }
)
Input.displayName = "Input" // 디버깅을 위한 이름 설정입니다.

export { Input }