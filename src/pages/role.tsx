import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { User } from "@prisma/client";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";


const ManageUserRole: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});

  useEffect(() => {
      if(sessionData?.user?.role != "admin"){
          router.push("/403");
      }
  }, []);
  const { data: allquery} = api.user.getAll.useQuery();

  // https://stackoverflow.com/questions/74830632/trpc-invalid-hook-call-in-react-function-component
  // useMutation is a hook, so you can't call it conditionally. Once you create the mutation, you can use its mutate to fire it.
  const updateUser = api.user.update.useMutation();
  const onChange = (userId:string, role: string) => {
    updateUser.mutate({userId: userId, role: role});
  }


  return (
    <>
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
          <div className="flex flex-col justify-center gap-4 place-content-center min-h-screen">
              <div className="flex flex-col">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full my-2 py-2 sm:px-6 lg:px-8">
                    <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded-full" href="/">
                      Home Page
                    </Link>
                    <h1 className="text-4xl text-white mt-3">Role Page</h1>
                      <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500">
                          <tr>
                            <th scope="col" className="px-6 py-4">Name</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allquery?.map(function(item, i){
                            return (
                              <Row key={i} user={item} onChangeHandler={onChange}/>
                            )
                          })}
                        </tbody>
                      </table>
                  </div>
                </div>
              </div>
          </div>
      </div>
      
    </>
  );
};

export default ManageUserRole;

type Option = {
  id: number,
  name: string,
  value: string
}
const options: Array<Option> = [
  { id: 1, name: 'Admin', value: 'admin'},
  { id: 2, name: 'Developer', value: 'developer'}, 
  { id: 3, name: 'QA', value: 'qa'},
  { id: 4, name: 'Random Role', value: 'randomRole'},
  { id: 5, name: 'Bob', value: 'bob'}
]
interface RowProps {
  onChangeHandler: (userId: string, role: string) => void
  user: User
}

const Row: React.FC<RowProps> = (props: RowProps) => {
  
  return (
    <tr className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap px-6 py-4 font-medium">{props.user.name}</td>
      <td className="whitespace-nowrap px-6 py-4">{props.user.email}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <select
          onChange={(e) => props.onChangeHandler(props.user.id, e.target.value)}
          className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
        >
          {<option disabled selected={props.user.role == null || props.user.role == ""} value="">
              Choose a role
            </option>}

          {options.map((option) => (
            <option
              key={option.id || option.value}
              value={option.value}
              selected={props.user.role === option.value}
              disabled={props.user.role === "admin"}
            >
              {option.name}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
};