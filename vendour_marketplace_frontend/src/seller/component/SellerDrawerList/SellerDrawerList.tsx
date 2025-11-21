import DrawerList from "../../../component/DrawerList/DrawerList";
import { menu, menu2 } from "../../../data/account/selllerData";



const SellerDrawerList = ({ toggle }: { toggle: () => void }) => {


    return (
        <>
            <DrawerList menu={menu} menu2={menu2} toggle={toggle} />
        </>
    );
};

export default SellerDrawerList;