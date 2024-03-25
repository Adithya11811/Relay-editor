'use client';
import App from './screens'

function Overlay() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <a
        href="https://pmnd.rs/"
        style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}
      >
        pmnd.rs
        <br />
        dev collective
      </a>
      <div
        style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }}
      >
        ok —
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          fontSize: '13px',
        }}
      >
        16/12/2022
      </div>
    </div>
  )
}

const Responsive = () => {
  return (
    <div className='h-screen '>
        Hello
      <App />
      <Overlay />
    </div>
  )
}
export default Responsive

