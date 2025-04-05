import React from "react";

export default function Contact(props: any) {
    console.log(props);
    return (
        <>
            <div>First short code component
                <input name="name" defaultValue={'supratim'} />
                <input name="lastname" defaultValue={'neogi'} />
                <input name="email" defaultValue={'supratim@gmail.com'} />
                <input name="phone" defaultValue={8777087255} />
            </div>

        </>

    )
}