"use client"

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

import { Select, SelectItem, Chip } from "@nextui-org/react";

import Dropdown from "@/pages/components/forms/Dropdown";
import MultiDropdown from "@/pages/components/forms/MultiDripdown";
import PreviewCard from "@/pages/components/PreviewCard";
import Preview from "@/public/avatar/eye.svg"

import AppContext from "@/providers/AppContext";
import BackBtn from "@/pages/components/BackBtn";
import { getChainList, getGiveaways, getServerRoles, getServers, handleEditGiveaway } from "@/hook";
import { IDropdownListProps, IGiveaway, IServer, IServerRole } from "@/utils/_type";

const EditGiveaway: React.FC = () => {

    const { selectedGiveawayID, setGiveawayEdited } = useContext(AppContext);
    const [serverRoles, setServerRoles] = useState<IServerRole[]>([]);
    const [restrictedRoles, setRestrictedRoles] = useState<IServerRole[]>([]);
    const [tempRestrictedRoles, setTempRestrictedRoles] = useState<IServerRole[]>([]);
    const [tempRequiredRoles, setTempRequiredRoles] = useState<IServerRole[]>([]);
    const [requiredRoles, setReqiuredRoles] = useState<IServerRole[]>([]);
    const [winningRole, setWinningRole] = useState<IServerRole>();
    const [giveawayDropdownList, setGiveawayDropdownList] = useState<IDropdownListProps[]>([]);
    const [serverDropdownList, setServerDropdownList] = useState<IDropdownListProps[]>([]);
    const [chainDropdownList, setChainDropdownList] = useState<IDropdownListProps[]>([]);
    const [filterData, setFilterData] = useState<IGiveaway>();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [chainList, setChainList] = useState<string[]>([]);
    const [expiresDate, setExpiresDate] = useState<any>();
    const [chain, setChain] = useState<string>("Ethereum");
    const [quantity, setQuantity] = useState<number>(1);
    const [type, setType] = useState<string>("Raffle");
    const [requiredAllRoles, setReqiuredAllRoles] = useState<boolean>(false);
    const [price, setPrice] = useState<number>();
    const [links, setLinks] = useState<string>("");
    const [requirements, setRequirements] = useState<string>("");
    const [serverValue, setServerValue] = useState<string>("");
    const [showCreditCard, setShowCreditCard] = useState<boolean>(false);
    const router = useRouter();


    const initAction = async () => {

        const tempServerList: IServer[] = await getServers();
        const tempGiveaways: IGiveaway[] = await getGiveaways();

        if (selectedGiveawayID) {
            if (tempGiveaways !== undefined) {
                if (tempGiveaways.length > 0) {
                    const tempFilterData: IGiveaway | undefined = tempGiveaways.find(item => item.messageID === selectedGiveawayID);
                    if (tempFilterData) {
                        setFilterData(tempFilterData);
                    }
                }
            }
        }

        if (tempServerList) {
            if (tempServerList.length > 0) {

                const tempChainList: [] = await getChainList(tempServerList[0].guildID);

                if (tempChainList) {
                    if (tempChainList.length > 0) {
                        const tempChainDropdownList: IDropdownListProps[] = tempChainList.map((item, index) => ({
                            name: item,
                            id: item,
                        }))
                        setChainDropdownList(tempChainDropdownList);
                    }
                }

                const tempSeverRoles: IServerRole[] = await getServerRoles(tempServerList[0].guildID);
                if (tempSeverRoles) {
                    if (tempSeverRoles.length > 0) {
                        setServerRoles(tempSeverRoles);
                        setTempRequiredRoles(tempSeverRoles);
                        setTempRestrictedRoles(tempSeverRoles)
                    }
                }
                const serverDropdownList: IDropdownListProps[] = tempServerList?.map((item, index) => {
                    return { name: item.guild.name, id: item.guild.id }
                })
                setServerDropdownList(serverDropdownList);
            }

            const tempGiveaways: IGiveaway[] = await getGiveaways();

            if (tempGiveaways) {
                if (tempGiveaways.length > 0) {
                    const tempGiveawayDropdownList: IDropdownListProps[] = tempGiveaways.map((item, index) => ({
                        name: item.type,
                        id: item.messageID,
                    }))
                    setGiveawayDropdownList(tempGiveawayDropdownList);
                }
            }
        }
    }

    const handleRequiredRolesChange = (object: any) => {
        const seleted: string[] = object.target.value.split(",");
        const tempRequiredRoles = serverRoles.filter(item => seleted.includes(item.id));

        setReqiuredRoles(tempRequiredRoles)
    }

    const handleRestrictedRolesChange = (object: any) => {
        const seleted: string[] = object.target.value.split(",");
        const tempRestrictedRoles = serverRoles.filter(item => seleted.includes(item.id));

        setRestrictedRoles(tempRestrictedRoles);
    }

    const handleSubmit = async () => {

        toast.error("Coming Soon");
        router.back();
        return setGiveawayEdited(true);

        // if (!serverValue || !expiresDate || !title || !description || !chain || !type || !quantity) {
        //     return toast.error("Please input all values");
        // }

        // const data = {
        //     serverID: serverValue,
        //     Expiry: expiresDate,
        //     title: title,
        //     description: description,
        //     chain: chain,
        //     type: type,
        //     quantity: quantity,
        //     price: price,
        //     requiredRoles: requiredRoles.map(item => item.id),
        //     restrictedRoles: restrictedRoles.map(item => item.id),
        //     winningRole: winningRole,
        //     requiredAllRoles: requiredAllRoles
        // }

        // await handleEditGiveaway(data);

    }

    const handleCreditCard = () => {
        setShowCreditCard(!showCreditCard);
    }

    useEffect(() => {
        initAction();
    }, [])

    useEffect(() => {
        // Initialize the date to current datetime if not already set
        if (!expiresDate) {
            setExpiresDate(new Date().toISOString().slice(0, 16)); // ISO format for datetime-local
        }
    }, [expiresDate]);

    useEffect(() => {
        console.log("serverRoles ===>", serverRoles);
        console.log("requiredRoles ===>", requiredRoles);

        const tRequiredRoles = serverRoles.filter(item => !restrictedRoles.includes(item));
        const tRestrictedRoles = serverRoles.filter(item => !requiredRoles.includes(item));

        setTempRequiredRoles(tRequiredRoles);
        setTempRestrictedRoles(tRestrictedRoles);
    }, [restrictedRoles, requiredRoles])

    return (
        <div className="p-8 grid md:grid-cols-2 md:grid-rows-1 gap-8 bg-cdark-100 relative">
            <div className="flex flex-col gap-4">
                <div className="flex gap-6 items-center justify-between">
                    <div className="flex gap-6 items-center">
                        <BackBtn />
                        <p className="text-cwhite text-2xl font-semibold">Edit Giveaway(coming soon)</p>
                    </div>
                    <div onClick={handleCreditCard} className="md:hidden block">
                        <Image
                            src={Preview}
                            width="24"
                            height="24"
                            alt="preview"
                        />
                    </div>
                </div>
                <div>
                    <Dropdown
                        dropdownList={serverDropdownList}
                        placeholder="Select server"
                        className="hover:bg-cdark-100 bg-cdark-200"
                        callback={setServerValue}
                    />
                </div>
                <div className="flex flex-col gap-3 text-cwhite">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-normal text-cwhite">Title*</p>
                        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="text-cwhite text-sm font-medium outline-none placeholder:text-sm placeholder:font-medium placeholder:text-cgrey-900 px-3 py-[10px] border border-cgrey-200 bg-cdark-50 rounded-md" />
                    </div>
                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-normal text-cwhite">Description*</p>
                        <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="text-cwhite text-start text-sm h-[65px] outline-none font-medium placeholder:text-sm placeholder:font-medium placeholder:text-cgrey-900 px-3 py-[10px] border border-cgrey-200 bg-cdark-50 rounded-md" />
                    </div>
                    {/* Expires */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-normal text-cwhite">Expires*</p>
                        {/* <div className="grid grid-cols-2 gap-3 w-full"> */}
                        <input type="date" onChange={(e) => setExpiresDate(e.target.value)} value={expiresDate} className="text-cwhite text-sm font-medium outline-none placeholder:text-sm placeholder:font-medium placeholder:text-cwhite px-3 py-[10px] border border-cgrey-200 bg-cdark-50 rounded-md" suppressContentEditableWarning={true} />
                        {/* <input type="time" placeholder="" onChange={(e) => setExpiresHour(e.target.value)} value={expiresHour} className="text-cwhite text-sm font-medium outline-none placeholder:text-sm placeholder:font-medium placeholder:text-cwhite px-3 py-[10px] border border-cgrey-200 bg-cdark-50 rounded-md" /> */}
                        {/* </div> */}
                    </div>
                    {/* Chain & Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Chain*</p>
                            <Dropdown
                                dropdownList={chainDropdownList}
                                placeholder="Select chain"
                                className="hover:bg-cdark-200 bg-cdark-100"
                                callback={setChain}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Quantity*</p>
                            <input type="number" placeholder="0" onChange={(e) => setQuantity(e.target.valueAsNumber)} value={quantity} className="text-cwhite text-sm font-medium outline-none placeholder:text-sm placeholder:font-medium placeholder:text-cgrey-900 px-3 py-[10px] border border-cgrey-200 bg-cdark-50 rounded-md" />
                        </div>
                    </div>
                    {/* Type & Winning role */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Type*</p>
                            <Dropdown
                                dropdownList={giveawayDropdownList}
                                placeholder="Select giveaway type"
                                className="hover:bg-cdark-200 bg-cdark-100"
                                callback={setType}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Winning Role*</p>
                            <MultiDropdown
                                dropdownList={serverRoles}
                                placeholder="Select winning role"
                                className="hover:bg-cdark-200"
                                callback={setWinningRole}
                            />
                        </div>
                    </div>
                    {/* Restricted Roles & Required Roles */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Restricted Roles*</p>
                            <Select
                                placeholder="Select Restricted Roles"
                                selectionMode="multiple"
                                className="rounded-lg"
                                classNames={{
                                    trigger: "bg-cdark-100 px-0 border-cgrey-200 border rounded-lg",
                                    innerWrapper: "px-4 py-3",
                                }}
                                listboxProps={{
                                    itemClasses: {
                                        base: [
                                            "rounded-none"
                                        ],
                                    }
                                }}
                                popoverProps={{
                                    classNames: {
                                        base: " rounded-none",
                                        content: "p-0 border border-cgrey-200 text-cwhite bg-cgrey-100 rounded-lg ",
                                    },
                                }}
                                size="lg"
                                selectorIcon={<></>}
                                isMultiline={true}
                                radius="sm"
                                onChange={handleRestrictedRolesChange}
                                renderValue={(items) => {
                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {items.map((item) => (
                                                <Chip key={item.key}>{"@" + item.textValue}</Chip>
                                            ))}
                                        </div>
                                    );
                                }}
                            >
                                {tempRestrictedRoles.map((item) => (
                                    <SelectItem key={item.id} value={item.id} className=" border rounded border-cgrey-100" style={{ backgroundColor: `${item.color}` }}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Required Roles*</p>
                            <Select
                                placeholder="Select Restricted Roles"
                                selectionMode="multiple"
                                className="rounded-lg "
                                classNames={{
                                    trigger: "bg-cdark-100 px-0 border-cgrey-200 border rounded-lg",
                                    innerWrapper: "px-4 py-3"
                                }}
                                listboxProps={{
                                    itemClasses: {
                                        base: [
                                            "rounded-none"
                                        ],
                                    }
                                }}
                                onChange={handleRequiredRolesChange}
                                popoverProps={{
                                    classNames: {
                                        base: " rounded-none",
                                        content: "p-0 border border-cgrey-200 text-cwhite bg-cgrey-100 rounded-lg ",
                                    },
                                }}
                                size="lg"
                                selectorIcon={<></>}
                                isMultiline={true}
                                radius="sm"
                                renderValue={(items) => {
                                    return (
                                        <div className="flex flex-wrap  gap-2">
                                            {items.map((item) => (
                                                <Chip key={item.key}>{"@" + item.textValue}</Chip>
                                            ))}
                                        </div>
                                    );
                                }}
                            >
                                {/* {serverRoles.map((item) => ( */}
                                {tempRequiredRoles.map((item) => (
                                    <SelectItem key={item.id} value={item.id} className="border rounded border-cgrey-100" style={{ backgroundColor: `${item.color}` }}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    {/* Required all roles */}
                    <div className="flex gap-2 hover:cursor-pointer w-fit" onClick={(e) => setReqiuredAllRoles(!requiredAllRoles)} >
                        <input type="checkbox" onChange={() => requiredAllRoles} className="rounded-[4px]" />
                        <p className="text-sm font-normal">Required all roles</p>
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-normal text-cwhite">Price*</p>
                        <input type="number" step="0.00001" placeholder="0.00001" min="0.00001" value={price} onChange={(e) => setPrice(e.target.valueAsNumber)} className="text-cwhite text-sm font-medium outline-none placeholder:text-sm placeholder:font-medium placeholder:text-cgrey-900 px-3 py-[10px] border grey-200grey-200 bg-cdark-50 rounded-md" />
                    </div>
                    {/* Links & Requirements */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Links</p>
                            <input type="url" placeholder="" value={links} onChange={(e) => setLinks(e.target.value)} className="text-cwhite text-sm font-medium outline-none placeholder:text-sm placeholder:font-medium placeholder:text-cgrey-900 px-3 py-[10px] border border-cgrey-200 bg-cdark-50 rounded-md" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-normal text-cwhite">Requirements</p>
                            <input type="text" placeholder="" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="text-cwhite text-sm font-medium outline-none placeholder:text-sm placeholder:font-medium placeholder:text-cgrey-900 px-3 py-[10px] border border-cgrey-200 bg-cdark-50 rounded-md" />
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <div onClick={handleSubmit} className="flex justify-center px-8 w-fit py-3 border border-[#EEEEEE] hover:bg-cdark-200 hover:text-cwhite hover:cursor-pointer hover:border-cgrey-200 rounded-lg bg-cwhite text-sm leading-4 font-medium">submit</div>
                </div>
            </div>
            {showCreditCard &&
                <div className="absolute">
                    <PreviewCard
                        title={title}
                        description={description}
                        expiry={expiresDate}
                        winningRole={winningRole}
                        chain={chain}
                        type={type}
                        quantity={quantity}
                        required={requiredRoles}
                        requirements={requirements}
                        price={price}
                    />
                </div>
            }
            <div className="hidden md:block">
                <PreviewCard
                    title={title}
                    description={description}
                    expiry={expiresDate}
                    winningRole={winningRole}
                    chain={chain}
                    type={type}
                    quantity={quantity}
                    required={requiredRoles}
                    requirements={requirements}
                    price={price}
                />
            </div>
        </div >
    );
}

export default EditGiveaway;

interface DataOption {
    value: string;
    label: string;
}

interface serverRole {
    id: string
    color: string
    name: string
}