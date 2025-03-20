import { Dispatch, PropsWithChildren, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

/**
 * Core Entity - Docs File or Photo
 * Features:
 * - Auth
 * - Channels with content (can be close or open)
 */

const db = {
  channels: [
    { id: 1, name: "Group 1", type: "close", premiumPrice: 10 },
    { id: 2, name: "Group 2", type: "open" },
  ],
  contents: [
    { id: 1, channelId: 1, title: "Math Course", description: "A deep knowledge" },
    { id: 2, channelId: 2, title: "C Course", description: "A perfect C Course" }
  ],
  contentData: [
    { contentId: 2, body: "lorem50" }
  ],
  premiumContentUsers: [
    { userId: 3, channelId: 1 }
  ],
  users: [
    { id: 1, name: "Vadim", password: "123456" }
  ]
}

const isAuth: boolean = true;
const user = { id: 1, name: "Vadim" }

function ContentCard({ title, body }: { title: string, body: string }) {
  return (
    <div className="card">
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}

const CARD_NUMBER_LENGTH: number = 16;

function ContentChannel() {
  const { id } = useParams();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState<boolean>(false);
  const contentChannel = db.channels.find(c => c.id === Number(id));

  if (!contentChannel) {
    return <h1>Page haven't founded!</h1>
  }

  if (contentChannel.type === "close") {
    const premiumUser = db.premiumContentUsers.find(u => u.userId === user.id)

    if (!isAuth) {
      return <p>This channel is private, please auth!</p>
    }

    if (!premiumUser) {
      return <div>
        <p>You don't have permission to access this private channel!</p>
        <button onClick={() => setPurchaseModalOpen(true)}>Upgrade to Premium</button>
        <Modal open={purchaseModalOpen} setOpen={setPurchaseModalOpen}>
          <p>Upgrade to Premium to access this private channel!</p>
          <form onSubmit={(e) => {
            e.preventDefault()
            setPurchaseModalOpen(false)
            db.premiumContentUsers.push({ userId: user.id, channelId: contentChannel.id })
          }}>
            <p>4444 4444 4444 4444</p>
            <p>22 22</p>
            <p>123</p>
            <h2>Price - {contentChannel.premiumPrice} $</h2>
            <input type="number" placeholder="Your card number" minLength={CARD_NUMBER_LENGTH} maxLength={CARD_NUMBER_LENGTH}/>
            <input type="number" placeholder="DA/TA" minLength={4} maxLength={4}/>
            <input type="number" placeholder="CVV" minLength={3} maxLength={3}/>
            <button>Upgrade</button>
          </form>
        </Modal>
      </div>
    }
  }

  return (
    <div>
      <h1>{contentChannel.name}</h1>
      <ul>
        {db.contents.filter(content => content.channelId === Number(id)).map(content => {
          return <Link to={`/content/${content.id}`}>
            <ContentCard title={content.title} body={content.description}/>
          </Link>
        })}
      </ul>
    </div>
  );
}

function ContentChannelCard({ name, isClosed }: { name: string, isClosed: boolean }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      {isClosed ? <strong>closed</strong> : ""}
    </div>
  );
}

function Modal({ children, open, setOpen }: {open: boolean, setOpen: Dispatch<boolean> } & PropsWithChildren) {
  return <dialog open={open}>
    {children}
    <button onClick={() => setOpen(false)}>Close</button>
  </dialog>
}

function Content() {
  const { id } = useParams();
  const contentData = db.contentData.find(data => data.contentId === Number(id));
  const content = db.contents.find(content => content.id === Number(id));

  return <div>
    <h1>{content?.title}</h1>
    <p>{contentData?.body}</p>
  </div>
}

export function App() {
  return <Routes>
    <Route path="/" element={<>
      <h1>Home</h1>
      {isAuth ? <h3>You're auth - {user.name}</h3> : <button>Auth</button>}
      <h2>Avaliable Groups:</h2>
      <ul className="list">
        {db.channels.map(channel => <Link to={`/channel/${channel.id}`}>
          <ContentChannelCard key={channel.id} name={channel.name} isClosed={channel.type === "close"}/>
        </Link>)}
      </ul>
    </>}/>
    <Route path="/channel/:id" element={<ContentChannel/>}/>
    <Route path="/content/:id" element={<Content/>}/>
  </Routes>
}