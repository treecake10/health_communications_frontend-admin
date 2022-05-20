import { AppBar, Toolbar, Typography } from "@mui/material";


const Navbar = () => {
    
    return (
        
        <AppBar position="static">
            <Toolbar style={{display: 'flex', justifyContent:"space-between"}}>
                <Typography variant="h6">
                    Health Communications
                </Typography>

                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                {localStorage.getItem("fullname")}
                </div>
                
            </Toolbar>
        </AppBar>
        
    );
};

export default Navbar;