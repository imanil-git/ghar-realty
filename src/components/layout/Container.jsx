export default function Container({ as: Tag = 'div', children, className = '', ...props }) {
  return (
    <Tag {...props} className={`mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16 ${className}`}>
      {children}
    </Tag>
  )
}
