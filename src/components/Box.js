const Box = ({ value, onSquareClick }) => {
  
  if(value==="O"){
   return (
     <>
       <div className='box' onClick={onSquareClick}>
         <i className='fa-regular fa-circle'></i>
       </div>
     </>
   )
  }
  else if(value==="X"){
  return (
     <>
       <div className='box' onClick={onSquareClick}>
         <i className='fa-solid fa-xmark'></i>
       </div>
     </>
   )
  }
  else{
   return (
     <>
       <div className='box' onClick={onSquareClick}>
       </div>
     </>
   )
  }
}
export default Box
