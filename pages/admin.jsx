import AdminConsole from '../src/components/AdminConsole';
import adminDict from '../src/lib/adminDict';

export default function AdminPage() {
  return <AdminConsole defaultRole="sysadmin" startScreen="adash" dict={adminDict} />;
}
