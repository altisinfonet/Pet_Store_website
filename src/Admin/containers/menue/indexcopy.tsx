import React, { useState } from 'react';
import SimpleCard from '../../components/SimpleCard';
import ActionDrop from '../../components/ActionDrop';

const Menue = () => {

    type T = {
        name: string,
        id: string
    }

    const [actionValue, setActionValue] = useState("Header Menu (Header Menu)")
    const [data, setData]: any = useState<T[]>();
    const [dataLeft, setDataLeft]: any = useState<T[]>();

    if (data && Array.isArray(data)) {
        const filteredDataRight = Object.values(data.reduce((acc, page) => {
            acc[page.id] = page;
            return acc;
        }, {}));

        console.log(filteredDataRight, "filteredData r");
    } else {
        console.error("Invalid input: pages should be a valid array");
    }

    if (dataLeft && Array.isArray(dataLeft)) {
        const filteredDataLeft = Object.values(dataLeft.reduce((acc, page) => {
            acc[page.id] = page;
            return acc;
        }, {}));

        console.log(filteredDataLeft, "filteredData l");
    } else {
        console.error("Invalid input: pages should be a valid array");
    }
   

    // console.log(filteredData, "filteredData")

    const handleDragStart = (e: any) => {
        e.dataTransfer.setData("text/plain", e.target.id);
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleDrop = (e: any) => {
        e.preventDefault();

        const draggedItemId: any = e.dataTransfer.getData("text/plain");
        const draggedItem: any = document.getElementById(draggedItemId);
        const target = e.target;
        console.log(e.target.id, "e__e")
        // Check if the draggedItem and the target are different elements
        if (draggedItem !== target) {
            // Check if target is an ancestor of draggedItem
            if (!draggedItem?.contains(target)) {
                target.appendChild(draggedItem);

                // Get the name of the dragged item
                const itemName = draggedItem.textContent.trim();
                const itemId = draggedItem.id;
                // console.log(itemId, "filteredData")
                // Update the state with the dropped item's data
                if (e.target.id === "right") {
                    console.log(itemId, "filteredData")
                    const arr = data?.length ? [...data] : [];
                    arr.push({ name: itemName, id: itemId });
                    setData(arr);
                }
                if (e.target.id === "left") {
                    console.log(itemId, "filteredData")
                    const arr = dataLeft?.length ? [...dataLeft] : [];
                    arr.push({ name: itemName, id: itemId });
                    setDataLeft(arr);
                }

            } else {
                // You may want to handle this case differently, such as swapping positions
                console.error("Ancestor cannot be a child.");
            }
        }
    };

    const pages = [
        { name: 'bari', id: "1" },
        { name: 'beral', id: "2" },
        { name: 'kukur', id: "3" },
        { name: 'bagh', id: "4" },
        { name: 'hathi', id: "5" },
        { name: 'bang', id: "6" },
        { name: 'shap', id: "7" },
    ];

    const actionArray = [
        { value: "Explore (Explore Menu)", name: "Explore (Explore Menu)" },
        { value: "Footer Menu (Footer Menu)", name: "Footer Menu (Footer Menu)" },
        { value: "Header Menu (Header Menu)", name: "Header Menu (Header Menu)" },
        { value: "Quick Links (Quick Menu)", name: "Quick Links (Quick Menu)" },
        { value: "Shopping (Shopping Menu)", name: "Shopping (Shopping Menu)" },
    ]
    const handleChangeAction = (e: any) => {
        setActionValue(e.target.value);
    }
    return (
        <div className='flex flex-col gap-8'>
            <div className='w-full flex items-center gap-1 p-4 border border-solid border-gray-300 bg-white shadow-md'>
                <span>Select a menu to edit:</span>
                <ActionDrop
                    btnValue="Apply"
                    selectFieldRootCls='w-80'
                    handleChange={handleChangeAction}
                    menuItemArray={actionArray}
                    value={actionValue}
                    btn
                />
            </div>

            <div className={`flex w-full gap-4 `}>
                <SimpleCard className={`tabView:w-[30%] w-2/4`} childrenClassName='flex justify-between' heading={<><span>Pages</span><div></div></>}>
                    <div id='left' className='w-full flex flex-col gap-4 max-h-full min-h-96 ' onDragOver={handleDragOver} onDrop={handleDrop}>
                        {pages.map((itm, i) => (
                            <div key={i} className='list' draggable onDragStart={handleDragStart} id={itm?.id}>
                                <div className='bg-slate-300 p-2 rounded'>{itm.name}</div>
                            </div>
                        ))}
                    </div>
                </SimpleCard>
                <SimpleCard className={`tabView:w-[70%] w-2/4`} childrenClassName='flex justify-between' heading={<><span>Menu Name: {actionValue}</span><div></div></>}>
                    <div id='right' className='w-full flex flex-col gap-4  max-h-full min-h-96 ' onDragOver={handleDragOver} onDrop={handleDrop}>
                    </div>
                </SimpleCard>
            </div>
        </div>
    );
};

export default Menue;
