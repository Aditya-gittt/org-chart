"use client"
import { experimental_useEffectEvent, useCallback, useEffect, useRef, useState } from "react"
import { Background, ReactFlow, Controls } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import axios from "axios";

interface nodeType {
  id: string,
  position: {
    x: number,
    y: number
  },
  data: {
    label: string
  }
};

interface edgeType {
  id: string,
  source: string,
  target: string
}

interface userType {
  name: string,
  role: string,
  id: string,
  email: string,
  managerId: string | undefined,
  subordinates: userType[]
}

type stackValue = userType & {position:{x:number, y:number }};

type stackType = stackValue[];


function useOutsideClick ( cb : () => void ) {

  const ref = useRef<HTMLDivElement>(null);

  // const handlercb = experimental_useEffectEvent( (e: Event) => {
  //   const element = ref.current;
  //   if(element && e.target instanceof Node && element.contains(e.target as Node) ){
  //     cb();
  //   }
  // } );

  const handlercb =  (e: Event) => {
    const element = ref.current;
    if(element && e.target instanceof Node && !element.contains(e.target as Node) ){
      cb();
    }
  } ;


  useEffect( () => {
    document.addEventListener("mousedown" , handlercb);
    document.addEventListener("touchstart" , handlercb );

    return () => {
      document.removeEventListener("mousedown" , handlercb);
      document.removeEventListener("touchstart" , handlercb);
    }
  }, []);

  return ref;
}


function page() {

  const [open, setOpen] = useState<boolean>(false);
  const [nodes, setNodes] = useState<nodeType[]>([]);
  const [edges, setEdges] = useState<edgeType[]>([]);
  const [nodeId, setNodeId] = useState<string>("");
  const [data, setData] = useState<userType[]>();
  const ref = useOutsideClick( () => {setOpen(false)}  );

  useEffect( () => {
    async function load () {
      const res = await axios.get<userType[]>('/api/backend');
      let data = res.data;

      
      const tops = data.filter( (u) => !u.managerId ) ;
      let top = tops[0];
      const stack: stackType = [];
      let x = 500;
      let y = 100;

      stack.push({
        ...top,
        position:{
          x:x,
          y:y
        }
      });

      const nodeList: nodeType[] = [];
      const edgeList: edgeType[] = [];

      nodeList.push({
        id: top.id,
        position: {
          x: x,
          y: y
        },
        data: {
          label: `${top.name} - ${top.role}`
        }
      });


      while(stack.length > 0){
        let currTop = stack.pop()!;

        if( !currTop.subordinates){
          continue;
        }
        const subsLength = currTop.subordinates.length;

        let currentSub = 1;
        for(const tempSub of currTop.subordinates){
          // add the node tonodeList and add the edge toEdgelist that starts from the top to sub

          let sub = (data.filter( (obj) => obj.id == tempSub.id ) )[0]

          if(currentSub <= subsLength/2){
            x = currTop.position.x - currentSub*100;
          }
          else {
             x = currTop.position.x + Math.ceil(currentSub/2)*100;
          }

          nodeList.push({
            id: sub.id,
            position: {
              x: x,
              y: currTop.position.y + 100
            },
            data: {
              label: `${sub.name} - ${sub.role}`
            }
          });

          stack.push({
            ...sub,
            position: {
              x: x,
              y: currTop.position.y + 100
            }
          });

          edgeList.push({
            id: `${currTop.id}-${sub.id}`,
            source: currTop.id,
            target: sub.id
          })

          currentSub++;

        }
      }
      console.log("\n\n node List : \n");
      console.log(nodeList);
      console.log("\n\n edge List : \n");
      console.log(edgeList);

      setNodes(nodeList);
      setEdges(edgeList);
      setData(data);
    }

    load();  // do we not have to await here ???
  } , [] );

  const getById = useCallback( (id: string) => {

    return data?.filter( (obj) => {
      return obj.id == id;
    } )[0] !;

  } , [data]);

  return (
    <div className="h-lvh w-lvw">
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={ (event,node) => {setOpen(true); setNodeId(node.id) } }>
        <Background/>
        <Controls/>
      </ReactFlow>
      
      {open && 
        <div className="bg-amber-700/50 bg-opacity-50 absolute top-0 left-0 h-lvh w-lvw">
        <div ref={ref} className="h-40 w-40  outline-dashed flex flex-col  bg-amber-300 z-10 m-auto my-[10%]" >

          <span className="w-[10%] font-extrabold ml-auto cursor-pointer" onClick={() => {setOpen(false); setNodeId("") }}>X</span>

          <div className="">
            {`${getById(nodeId).name} - ${getById(nodeId).role}`}
          </div>

        </div>
        </div>}
    </div>
  )
}

export default page