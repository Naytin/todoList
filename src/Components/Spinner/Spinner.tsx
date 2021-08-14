import './index.css'

type PropsType = {
    color?: string
}

export const Spinner = ({color}: PropsType) => {

    const dot = [...Array(12).fill(1)].map((e, i) =>
        color ? <div key={e + i * i} style={{background: color}}/> : <div key={e + i * i}/>)

    return (
        <div className="lds-default">
            {dot}
        </div>)
}