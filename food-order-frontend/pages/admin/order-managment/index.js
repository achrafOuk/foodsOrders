import AdminNavbar from "../../../components/dashboard/navbar";
import AdminSidebar from "../../../components/dashboard/sidebar";
import AdminTable from "../../../components/dashboard/table";
import { useEffect, useState } from "react";
import Pagination from "../../../components/pagination/pagination";
import { routes } from "../../../routes";
import OrderTable from "../../../components/dashboard/OrderTable";
import { useRouter } from "next/router";
async function fetch_orders()
{
  let request = {
    method: 'GET',
    credentials: "include",
  };
  let orders_api = await fetch(`/api/orders/`,request);
  orders_api = await orders_api.json();
}
export default function food_mangment({ orders, pages_counter,user_token, isUserAuth }) {
  let router = useRouter();
  let page = router.query["page"] ?? 1;
  let [currentPage, setCurrentPage] = useState(parseInt(page));
  let [PageCounter, setPageCounter] = useState(pages_counter);
  let [Orders, setOrders] = useState(orders);
  console.log('page counter:',pages_counter);
  useEffect(() => { fetch_orders(); }, []);
  useEffect(()=>{ setOrders(orders); },[orders]) 
  return (
    <div className="flex h-screen bg-gray-50 ">
      <AdminNavbar></AdminNavbar>
      <div className="flex flex-col flex-1 w-full">
        <AdminSidebar></AdminSidebar>
        <main className="h-full overflow-y-auto">
          <OrderTable
            orders={Orders}
            currentPage={currentPage}
            user_token={user_token}
            isUserAuth={isUserAuth}
          />
          <Pagination
            PageNumbers={PageCounter}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            url={`/admin/order-managment?page=`}
          ></Pagination>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  // check is user is authentificated
  const cookies = context.req.headers.cookie;
  let headers = {  'access_token':cookies  };
  let request = {
    method: 'GET',
    redirect: 'follow',
    headers: headers,
  };
  let host = context.req.headers.host
  let currentPage = context.query.page;
  let orders_api = await fetch(`http://${host}/api/orders/`,request);
  orders_api = await orders_api.json();
  let user_token =cookies?.split('=')[1];
  let isUserAuth =  user_token !== undefined ? true: false;
  const req = context.req;
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${user_token}`);
  
  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    credentials: "same-origin",
  };
  let res = await fetch(`${routes.ORDER}?page=${currentPage}`,requestOptions);
  res = await res.json();
  let orders = res?.data;
  let pages_counter = res?.last_page;
  console.log('page counter:',pages_counter);
  return {
    props: {
      user_token,
      isUserAuth,
      orders,
      pages_counter
    },
  };
}

