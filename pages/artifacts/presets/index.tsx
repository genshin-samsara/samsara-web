import React, {useEffect, useState} from "react";
import Head from "next/head";
import {ArtifactsDomainsData, RotationStorage} from "@/artifacts/types";
import {V1StorageKey} from "@/artifacts/rotations";
import PresetAndRotationSummary from "@/components/artifacts/PresetAndRotationSummary";


export default function ManageArtifactRotationPresets({}) {
    const [storage, setStorage] = useState({})

    useEffect(() => {
        try {
            const rotationStorage: RotationStorage = JSON.parse(localStorage.getItem(V1StorageKey) || "{}")

            if (!rotationStorage.active) {
                return
            }

            setStorage(rotationStorage)
        } catch (ignore) {

        }
    }, [])

    return (
        <>
            <Head>
                <title>Artifact Rotations - Samsara</title>
            </Head>

            <PresetAndRotationSummary
                storage={storage}
                setStorage={setStorage}
            />
        </>
    )
}