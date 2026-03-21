export function Skeleton({ w = '100%', h = 16, r = 8, style = {} }: {
  w?: string | number; h?: number; r?: number; style?: React.CSSProperties
}) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      ...style
    }}/>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <Skeleton w="100%" h={150} r={0}/>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton h={16} w="80%"/>
        <Skeleton h={12} w="50%"/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <Skeleton h={12} w="30%"/>
          <Skeleton h={14} w="20%"/>
        </div>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton h={12} w="60%"/>
      <Skeleton h={28} w="40%"/>
      <Skeleton h={10} w="50%"/>
    </div>
  )
}
