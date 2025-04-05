import { Checkbox, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

const DynamicForm = ({ dynOb, handelSubmit, submitBtn, sendDataState, preState, dynamicFormRootCls }: Props) => {

    const [formData, setFormData]: any = useState(new Object);
    const [formDataError, setFormDataError]: any = useState(new Object);

    const fomtMPb2 = `font-medium !pb-2 !text-black`

    const handelState = (target?: any) => {
        const name: any = target.name;
        const value: any = target.value;
        setFormData({ ...formData, [name]: value });
        console.log(Object.keys(formData), "formData[name]")
    }

    const handleCheck = (target?: any) => {
        const name: any = target.name;
        const checked: any = target.checked;
        console.log(target, "__-target")
        setFormData({ ...formData, [name]: checked });
        console.log(Object.keys(formData), "formData[name]")
    }

    // const handelStateError = (target?: any) => {
    //     const name: any = target.name;
    //     const value: any = target.value;
    //     setFormDataError({ ...formDataError, [name]: value });
    //     console.log(name, "objectValue")
    // }

    // useEffect(()=> {
    //     setFormDataError( Object.keys(dynOb).map((key: any) => dynOb[key]['name']))
    // },[])
    console.log(formData, "_formData_")
    // console.log(dynOb, "formDataformDataError")

    useEffect(() => {
        console.log("preState", preState)
        // if (preState) {
        setFormData(preState)
        // }
    }, [preState]);

    const handelOnSubmit = () => {
        let isValidate = true;
        for (let key in formData) {
            console.log(formData[key], "formData[key]")
            if (!formData[key]) {
                isValidate = false;
                setFormDataError({ ...formDataError, [key]: "This field can not be empty" })
            } else {
                setFormDataError({ ...formDataError, [key]: "" })
            }
        }
    }


    const textFieldGenerate = (data: any) => {

        if (Array.isArray(data)) {
            console.log(data, "_datadatadatas")
            return (
                <div>
                    {data.map((v, i) => {
                        return (
                            <div key={i} className={`${v['isCard'] ? `border border-solid border-slate-400 ` : ``}`}>
                                {v['isCard'] ? <>
                                    <div className={`bg-offWhite-03 p-2`}>{v['label']}</div>
                                    <hr className={`border-slate-400`} />
                                </> : null}
                                <div className={`${v['isCard'] ? `p-2 bg-white` : ``}`}>
                                    {v['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{v['label']}</InputLabel>}
                                    <TextField
                                        className='dynFormTextFieldCls rounded bg-white'
                                        fullWidth
                                        type={v["fieldType"]}
                                        style={v['style'] ? v['style'] : null}
                                        name={v['name']}
                                        value={formData[v['name']] ? formData[v['name']] : ""}
                                        id={v['id']}
                                        // label={v['label']}
                                        variant={v['variant']}
                                        onChange={(e) => { handelState(e.target) }}
                                        key={i}
                                        error={formDataError[v['name']] ? true : false}
                                        placeholder={'Enter ' + v['label']}
                                    // helperText="Incorrect entry."
                                    />
                                    {v['helperText'] ? <FormHelperText className={v['isError'] ? `!text-red-400` : ``}>{v['helperText']}</FormHelperText> : null}
                                </div>
                            </div>)
                    })}
                </div>
            );
        }
        return (
            <div className={`${data['isCard'] ? `border border-solid border-slate-400` : ``}`}>
                {data['isCard'] ? <>
                    <div className={`bg-offWhite-03 p-2`}>{data['label']}</div>
                    <hr className={`border-slate-400`} />
                </> : null}
                <div className={`${data['isCard'] ? `p-2 bg-white` : ``}`}>
                    {data['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{data['label']}</InputLabel>}
                    <TextField
                        className='dynFormTextFieldCls rounded bg-white'
                        fullWidth
                        type={data["fieldType"]}
                        style={data['style'] ? data['style'] : null}
                        name={data['name']}
                        value={formData[data['name']] ? formData[data['name']] : ""}
                        id={data['id']}
                        // label={data['label']}
                        variant={data['variant']}
                        onChange={(e) => { handelState(e.target) }}
                        error={formDataError[data['name']] ? true : false}
                        placeholder={'Enter ' + data['label']}
                    // helperText="Incorrect entry."
                    />
                    {data['helperText'] ? <FormHelperText className={data['isError'] ? `!text-red-400` : ``}>{data['helperText']}</FormHelperText> : null}
                </div>
            </div>
        );
    }

    const textAreaFieldGenerate = (data: any) => {

        if (Array.isArray(data)) {
            console.log(data, "_datadatadatas")
            return (
                <div>
                    {data.map((v, i) => {
                        return (
                            <div key={i} className={`${v['isCard'] ? `border border-solid border-slate-400` : ``}`}>
                                {v['isCard'] ? <>
                                    <div className={`bg-offWhite-03 p-2`}>{v['label']}</div>
                                    <hr className={`border-slate-400`} />
                                </> : null}
                                <div className={`${v['isCard'] ? `p-2 bg-white` : ``}`}>
                                    {v['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{v['label']}</InputLabel>}
                                    <textarea
                                        className={`${v['dynFormTextAreaFieldCls']} rounded bg-white`}
                                        style={v['style'] ? v['style'] : null}
                                        name={v['name']}
                                        value={formData[v['name']] ? formData[v['name']] : ""}
                                        id={v['id']}
                                        onChange={(e) => { handelState(e.target) }}
                                        key={i}
                                        placeholder={'Enter ' + v['label']}
                                    />
                                    {v['helperText'] ? <FormHelperText className={v['isError'] ? `!text-red-400` : ``}>{v['helperText']}</FormHelperText> : null}
                                </div>
                            </div>)
                    })}
                </div>
            );
        }
        return (
            <div className={`${data['isCard'] ? `border border-solid border-slate-400` : ``}`}>
                {data['isCard'] ? <>
                    <div className={`bg-offWhite-03 p-2`}>{data['label']}</div>
                    <hr className={`border-slate-400`} />
                </> : null}
                <div className={`${data['isCard'] ? `p-2 bg-white` : ``}`}>
                    {data['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{data['label']}</InputLabel>}
                    <textarea
                        className={`${data['dynFormTextAreaFieldCls']} rounded bg-white`}
                        style={data['style'] ? data['style'] : null}
                        name={data['name']}
                        value={formData[data['name']] ? formData[data['name']] : ""}
                        id={data['id']}
                        onChange={(e) => { handelState(e.target) }}
                        placeholder={'Enter ' + data['label']}
                    />
                    {data['helperText'] ? <FormHelperText className={data['isError'] ? `!text-red-400` : ``}>{data['helperText']}</FormHelperText> : null}
                </div>
            </div>
        );
    }


    const dropDownFieldGenerate = (data: any) => {
        console.log(data, "_datadatadata")
        console.log(formData, "console.log(data['MenuItem'])")
        if (Array.isArray(data)) {
            return (
                <div>
                    {data.map((v, i) => {
                        return (
                            <div key={i} className={`${v['isCard'] ? `border border-solid border-slate-400` : ``}`}>
                                {v['isCard'] ? <>
                                    <div className={`bg-offWhite-03 p-2`}>{v['label']}</div>
                                    <hr className={`border-slate-400`} />
                                </> : null}
                                <div className={`${v['isCard'] ? `p-2 bg-white` : ``}`}>
                                    {v['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{v['label']}</InputLabel>}
                                    <FormControl fullWidth className='p-0'>
                                        <Select
                                            className='dynformDropCls bg-white'
                                            id={v['id']}
                                            onChange={(e) => { handelState(e.target) }}
                                            value={formData[v['name']] ? formData[v['name']] : `Select video type`}
                                            name={v['name']}
                                        >
                                            {v['MenuItem']?.map((itm: any, idx: number) => <MenuItem key={idx} value={itm?.value}>{itm?.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    {v['helperText'] && <FormHelperText className={v['isError'] ? `!text-red-400` : ``}>{v['helperText']}</FormHelperText>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            );
        }
        return (
            // <TextField name={data['name']} value={data['value']} id={data['id']} label={data['label']} variant={data['variant']} />
            <div className={`${data['isCard'] ? `border border-solid border-slate-400` : ``}`}>
                {data['isCard'] ? <>
                    <div className={`bg-offWhite-03 p-2`}>{data['label']}</div>
                    <hr className={`border-slate-400`} />
                </> : null}
                <div className={`${data['isCard'] ? `p-2 bg-white` : ``}`}>
                    {data['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{data['label']}</InputLabel>}
                    <FormControl fullWidth className='p-0'>
                        <Select
                            className='dynformDropCls bg-white'
                            id={data['id']}
                            value={formData[data['name']] ? formData[data['name']] : `Select video type`}
                            onChange={(e) => { handelState(e.target), console.log(e, "Eeeeee") }}
                            name={data['name']}
                        >
                            {data['MenuItem'].map((itm: any, idx: number) => <MenuItem key={idx} value={itm?.value} disabled={itm?.disabled}>{itm?.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {data['helperText'] && <FormHelperText className={data['isError'] ? `!text-red-400` : ``}>{data['helperText']}</FormHelperText>}
                </div>
            </div>
        );
    }

    const checkFieldGenerate = (data: any) => {
        console.log(data, "_datadatadata")
        console.log(formData, "console.log(data['MenuItem'])")
        if (Array.isArray(data)) {
            return (
                <div>
                    {data.map((v, i) => {
                        return (
                            <div key={i} className={`${v['isCard'] ? `border border-solid border-slate-400` : ``}`}>
                                {v['isCard'] ? <>
                                    <div className={`bg-offWhite-03 p-2`}>{v['label']}</div>
                                    <hr className={`border-slate-400`} />
                                </> : null}
                                <div className={`${v['isCard'] ? `p-2 bg-white` : ``}`}>
                                    {v['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{v['label']}</InputLabel>}
                                    <div className='flex items-center gap-2'>
                                        <Checkbox sx={{
                                            color: "#d8428c",
                                            '&.Mui-checked': {
                                                color: "#d8428c",
                                            },
                                        }}
                                            disabled={v['disabled']} checked={v['checked']} onChange={(e) => handleCheck(e.target)} name={v['name']} />
                                        <span>{v['name']}</span>
                                    </div>
                                    {v['helperText'] && <FormHelperText className={v['isError'] ? `!text-red-400` : ``}>{v['helperText']}</FormHelperText>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            );
        }
        return (
            <div className={`${data['isCard'] ? `border border-solid border-slate-400` : ``}`}>
                {data['isCard'] ?
                    <>
                        <div className={`bg-offWhite-03 p-2`}>{data['label']}</div>
                        <hr className={`border-slate-400`} />
                    </> : null}
                <div className={`${data['isCard'] ? `p-2 bg-white` : ``}`}>
                    {data['isCard'] ? null : <InputLabel className={`${fomtMPb2}`}>{data['label']}</InputLabel>}
                    <div className='flex items-center gap-2'>
                        <Checkbox sx={{
                            color: "#d8428c",
                            '&.Mui-checked': {
                                color: "#d8428c",
                            },
                        }}
                            disabled={data['disabled']} checked={data['checked']} onChange={(e) => handleCheck(e.target)} name={data['name']} />
                        <span>{data['name']}</span>
                    </div>
                    {data['helperText'] && <FormHelperText className={data['isError'] ? `!text-red-400` : ``}>{data['helperText']}</FormHelperText>}
                </div>
            </div>
        );
    }

    // let dynOb: any = {
    //     "T1": {
    //         type: "TextField",
    //         value: "T1",
    //         label: "T1",
    //         id: "T1",
    //         variant: "outlined",
    //         name: "T1",
    //         style: {
    //             width: '15rem'
    //         }
    //     },
    //     "D1": {
    //         type: "dropField",
    //         value: "d1",
    //         label: "d1",
    //         id: "d1",
    //         variant: "outlined",
    //         name: "d1",
    //         style: {
    //             width: '15rem'
    //         },
    //         MenuItem: [{
    //             name: 'val1', value: "val1"
    //         }, {
    //             name: 'val2', value: "val2"
    //         }]
    //     },
    //     "T2": {
    //         type: "TextField",
    //         value: "T2",
    //         label: "T2",
    //         id: "T2",
    //         variant: "outlined",
    //         name: "T2",
    //         style: {
    //             width: '15rem'
    //         }
    //     },
    // }

    console.log(formDataError, "formDataError");

    //** Render the component data*/
    useEffect(() => {

        if (formData) {
            sendDataState(formData)
        }
        console.log(formData, "pr__")
    }, [formData])

    return (
        <div className={`flex w-full flex-col gap-2 ${dynamicFormRootCls}`}>
            {
                Object.keys(dynOb).map((key: any, idx: number) => {
                    return (
                        <div key={idx} className='pb-1 h-fit'>
                            {dynOb[key]['type'] == "textField" && textFieldGenerate(dynOb[key])}
                            {dynOb[key]['type'] == "textAreaField" && textAreaFieldGenerate(dynOb[key])}
                            {dynOb[key]['type'] == "dropField" && dropDownFieldGenerate(dynOb[key])}
                            {dynOb[key]['type'] == "checkField" && checkFieldGenerate(dynOb[key])}
                        </div>

                    )
                })
            }
            {submitBtn ? <button type='button' onClick={() => { handelSubmit(formData); handelOnSubmit() }}> Submit </button> : null}
        </div>
    )

}

interface Props {
    dynOb?: any,
    handelSubmit?: any,
    submitBtn?: boolean,
    sendDataState?: any
    preState?: any,
    dynamicFormRootCls?: any
}

export default DynamicForm