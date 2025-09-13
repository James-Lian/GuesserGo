import { useContext } from "react";
import { GlobalContext } from "../components/Context";

export const useGlobals = () => useContext(GlobalContext)