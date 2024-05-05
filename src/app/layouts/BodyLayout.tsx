
export default  function BodyLayout({children}:{children:React.ReactNode}){
  return(
       <div  className=" w-full lg:w-3/6 mx-auto h-screen">
            {children}
       </div>
  )
} 