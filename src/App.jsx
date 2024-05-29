import { useState } from 'react'

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

let id=499476;

function Button({children,onClick}){
  

  return (
    <div>
        <button onClick={onClick} className='button'>{children}</button>
  
    </div>
  )
  }

function App() {

  const[showFriend, setShowFriend]=useState(false)
  const [friends,setFriends]=useState(initialFriends)
  const[selectFriend, setSelectFriend]=useState(null)

  function handleShowFriend(){
    setShowFriend((show)=>!show)
  }
  
  function addFriend(friend){
    setFriends((friends)=>[...friends,friend])
    setShowFriend(false)
  }

  function handleSelection(friend){
    // setSelectFriend(friend)
    setSelectFriend((curr)=>curr?.id==friend.id ? null : friend)
    setShowFriend(false)

  }

  function handleSplitBill(value){
    setFriends((friends)=>
    friends.map(friend=>
      friend.id===selectFriend.id ? {...friend, balance:friend.balance+value}: friend))

    setSelectFriend(null)
  }

  return (
    <div className='app'>
    <div className='sidebar'>
      <FriendList friends={friends} onSelect={handleSelection} selectFriend={selectFriend}/>

      {showFriend && <FormAddFriend onAddFriend={addFriend}/>}
      <Button onClick={handleShowFriend} setShowFriend={setShowFriend}>{showFriend ? "Close": "Add Friend" }</Button>
    </div>
    {selectFriend && <FormSplitBill selectFriend={selectFriend} onSplit={handleSplitBill}/>}
    </div>
  )
}

function FriendList({friends,onSelect, selectFriend}){
  
  return(
    <div>
      <ul>{friends.map((friend)=>
        <Friend friend={friend} key={friend.id} onSelect={onSelect} selectFriend={selectFriend}/>
      )}</ul>
    </div>
  )
}


function Friend({friend, onSelect,selectFriend}){

  const isSelected=selectFriend?.id===friend.id
  // console.log(friend)
  return(
    <div>
    <li className={isSelected ? "selected":""}>
      <img src={friend.image} alt={friend.name}/>
      <h3>{friend.name}</h3>
      {friend.balance<0 && <p className='red'>You owe {friend.name} {Math.abs(friend.balance)}$</p>}
      {friend.balance>0 && <p className='green'> {friend.name} owes you {Math.abs(friend.balance)}$</p>}
      {friend.balance==0 && <p>You and {friend.name} are even!</p>}
      <Button onClick={()=>onSelect(friend)}>{isSelected ? "Close":"Selected"}</Button>

    </li>
    </div>
  )
}



function FormAddFriend({onAddFriend}){
  const[name,setName]=useState("")
  const[image,setImage]=useState("https://i.pravatar.cc/48")

  function handleSubmit(e){
    e.preventDefault();

    if(!name || !image){
      return;
    }
     id++;

    const newFriend={
      id,
      name,
      image:`${image}?=${id}`,
      balance:0,
    }
      onAddFriend(newFriend)

  }

  return (
    <div>
      <form className='form-add-friend' onSubmit={handleSubmit}>
        <label> Name 🤟</label>
        <input type='text' value={name} onChange={(e)=>{setName(e.target.value)}}/>

        <label> Image URL 🖼</label>
        <input type='text' value={image} onChange={(e)=>{setImage(e.target.value)}}/>

        <Button>Add</Button>
      </form>
    </div>
  )
}

function FormSplitBill({selectFriend,onSplit}){
  const[bill,setBill]=useState("")
  const[userPaid,setUserPaid]=useState("")
  const[whoPaying,setWhoPaying]=useState("user")

  let friendExpense=bill ? bill-userPaid:""
  function handleSubmission(e){
    e.preventDefault();
    if(!bill || !userPaid ){return}
    onSplit(whoPaying=="user" ? friendExpense:-friendExpense)


  }
  return(
    <div>
      <form className='form-split-bill' onSubmit={handleSubmission}>
      <h2>Split a bill with {selectFriend.name}</h2>

        <label> Bill Value 💵</label>
        <input type='text' value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

        <label> Your expenses</label>
        <input type='text' value={userPaid} onChange={(e)=>setUserPaid(
          Number(e.target.value)>bill ? userPaid: Number(e.target.value) )}/>


        <label> {selectFriend.name} Expense</label>
        <input type='text' value={friendExpense} disabled/>


        <label> Who is Paying ?</label>
        <select value={whoPaying} onChange={(e)=>setWhoPaying(e.target.value)}>
          <option value="user">You</option>
          <option>{selectFriend.name}</option>
        </select>

        <Button>Split Bill</Button>

      </form>
    </div>
  )
}


export default App
