export default async function UsersPage() {
    const res = await fetch("http://localhost:5001/api/users", {
        cache: "no-store",
    });

    const result = await res.json();

    return (
        <div style={{ padding: 30 }}>
            <h1>Users List</h1>

            {result.data?.map((user: any) => (
                <div
                
                    key={user.id}
                    style={{
                        border: "1px solid #ddd",
                        padding: 12,
                        marginTop: 10,
                        borderRadius: 8,
                    }}
                >
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    );
}