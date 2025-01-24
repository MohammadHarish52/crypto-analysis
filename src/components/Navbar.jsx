import {
  Box,
  Button,
  ButtonGroup,
  InputBase,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaSearch, FaInfoCircle, FaChevronDown } from "react-icons/fa";
import { useState } from "react";

const NavContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  backgroundColor: "#111",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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

const Navbar = ({ onMarketCapRangeChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRange, setSelectedRange] = useState(100);

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
    <NavContainer>
      <Logo>
        <img
          src="https://i.ibb.co/znbC3SV/Group.jpg"
          alt="Logo"
          className="rounded-full h-10 w-10"
        />
        <span>Coinchart.fun</span>
      </Logo>

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

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          <span style={{ color: "white" }}>Need API Access?</span>
          <FaInfoCircle style={{ color: "#3B82F6" }} />
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#111",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          Premium
        </Button>
      </Box>
    </NavContainer>
  );
};

export default Navbar;
