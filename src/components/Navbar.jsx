import { Box, Button, InputBase, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaSearch, FaChevronDown, FaTelegram } from "react-icons/fa";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const NavContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  backgroundColor: "#111",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  width: "calc(100% - 380px)",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1100,
}));

const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
  padding: "8px 16px",
  width: "300px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  "& img": {
    width: "32px",
    height: "32px",
  },
  "& span": {
    color: "#fff",
    fontSize: "20px",
    fontWeight: 600,
  },
}));

const WalletButton = styled(WalletMultiButton)(({ theme }) => ({
  backgroundColor: "#111",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "white",
  padding: "8px 16px",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  "& .wallet-adapter-button-trigger": {
    background: "none",
  },
}));

const Navbar = ({ onMarketCapRangeChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRange, setSelectedRange] = useState(100);
  const { publicKey, connected } = useWallet();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (range) => {
    if (typeof range === "number") {
      setSelectedRange(range);
      onMarketCapRangeChange(range);
    }
    setAnchorEl(null);
  };

  return (
    <NavContainer sx={{ backgroundColor: "#19202F" }}>
      <Logo>
        <img
          src="https://i.ibb.co/znbC3SV/Group.jpg"
          alt="Logo"
          style={{ width: "32px", height: "32px", borderRadius: "50%" }}
        />
        <span style={{ color: "white", fontSize: "20px", fontWeight: 600 }}>
          Coinchart.fun
        </span>
      </Logo>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <SearchBar>
          <FaSearch
            style={{ color: "rgba(255, 255, 255, 0.5)", marginRight: "8px" }}
          />
          <InputBase
            placeholder="Search Crypto Currencies"
            sx={{
              color: "white",
              width: "100%",
              "& input::placeholder": {
                color: "rgba(255, 255, 255, 0.5)",
                opacity: 1,
              },
            }}
          />
        </SearchBar>

        <Button
          onClick={handleClick}
          endIcon={<FaChevronDown />}
          sx={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "white",
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          Top {selectedRange}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
          PaperProps={{
            sx: {
              backgroundColor: "#111",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "& .MuiMenuItem-root": {
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              },
            },
          }}
        >
          {[100, 200, 300].map((range) => (
            <MenuItem key={range} onClick={() => handleClose(range)}>
              Top {range}
            </MenuItem>
          ))}
        </Menu>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>
            Need API Access?
          </span>
          <FaTelegram style={{ color: "#3B82F6" }} />
        </Box>
      </Box>
    </NavContainer>
  );
};

export default Navbar;
