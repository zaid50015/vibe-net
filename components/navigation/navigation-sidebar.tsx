import NavigationAction from "./navigation-action";


const NavigationSideBar = () => {
  return (
    <div className="h-full w-full flex flex-col items-center space-y-4 dark:bg-[#000000] py-3  text-primary" >
       <NavigationAction/>
    </div>
  )
}

export default NavigationSideBar;