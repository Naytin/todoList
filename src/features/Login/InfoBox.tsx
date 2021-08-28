import React, {DetailedHTMLProps, HTMLAttributes, useState} from "react";
import {icons} from "../../assets/icons";

type DefaultPropsType = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
type Ibox = DefaultPropsType & {
    children?: React.ReactNode
}

export const InfoBox = ({children, ...restprops}:Ibox) => {
    const [open, setOpen] = useState<boolean>(false)

    function openHandler() {
        setOpen(state => !state)
    }
    return (
        <div className='w-full flex flex-col items-end '>
            <i onClick={openHandler} className='shadow-lg w-6 rounded-full cursor-pointer' >
                {icons.info}
            </i>
            {children ? open && children : open &&
                <div
                    className='w-10/12 rounded-t-lg rounded-bl-lg bg-yellow-100 p-4 shadow-2xl absolute left-2 -top-24'>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}
                           rel='noreferrer'
                           className='ml-2 font-medium text-1xl'>
                            HERE
                        </a>
                    </p>
                    <p>or use test account credentials:</p>
                    <p>EMAIL: worlddesign1987@gmail.com</p>
                    <p>PASSWORD: 123456</p>
                </div>

            }
        </div>
    )
}