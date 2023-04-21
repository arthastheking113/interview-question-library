import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";

const PositionEdit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});
  const { data: position} = api.position.getPositionDetails.useQuery({ id: id as string });
  const ctx = api.useContext();



  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
        {(() => {
          if (sessionData != null) {
            return (
              <>
                <h4 className="text-4xl">Edit question</h4>

                <h4 className="text-4xl">{position?.title}</h4>

                <>{position?.description}</>
              </>
            )
          }
        })()}
        

      </div>
    </>
    
  );
};


export default PositionEdit;