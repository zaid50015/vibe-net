
// As soon as someone hits sing-up , sign-in this layout comes int to play

const Authlayout = ({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) => {
  return (
    <div className='h-full flex items-center justify-center'>
        {children}
    </div>
  )
}

export default Authlayout