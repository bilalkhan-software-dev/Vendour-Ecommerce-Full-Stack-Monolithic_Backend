import DrawerList from "../../../component/DrawerList/DrawerList";
import { adminMenu1, adminMenu2 } from "../../../data/admin/adminMenu";

const AdminDrawerList = ({ toggle }: { toggle: () => void }) => {
    return (
        <>
            <DrawerList menu={adminMenu1} menu2={adminMenu2} toggle={toggle} />
        </>
    );
};

export default AdminDrawerList;