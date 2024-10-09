import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/sys/dashboard');
  
  // 以下原有代码将不会执行
  // return (
  //   <div className="grid grid-rows-[20px_1fr_20px] ...">
  //     ...
  //   </div>
  // );
}