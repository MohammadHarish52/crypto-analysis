import {
  Box,
  Button,
  InputBase,
  IconButton,
  Drawer,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaSearch, FaChevronDown, FaTelegram, FaBars } from "react-icons/fa";
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
  width: "100%",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1100,
  [theme.breakpoints.up("md")]: {
    width: "calc(100% - 380px)",
  },
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
  [theme.breakpoints.down("md")]: {
    width: "200px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%", // Full width for mobile
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

const Navbar = ({ onMarketCapRangeChange, onToggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRange, setSelectedRange] = useState(100);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <NavContainer sx={{ backgroundColor: "#19202F" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{ mr: 1, color: "white" }} // Ensure icon is white
            >
              <FaBars />
            </IconButton>
          )}

          <Logo>
            <img
              src="https://i.ibb.co/znbC3SV/Group.jpg"
              alt="Logo"
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
            {!isMobile && (
              <span
                style={{ color: "white", fontSize: "20px", fontWeight: 600 }}
              >
                Coinchart.fun
              </span>
            )}
          </Logo>

          {/* Breadcrumbs without Home and Signals links */}
          {!isMobile && (
            <Breadcrumbs
              separator="›"
              sx={{
                ml: 2,
                color: "rgba(255, 255, 255, 0.5)",
                "& .MuiBreadcrumbs-separator": {
                  mx: 1,
                },
                flexWrap: "wrap", // Allow breadcrumbs to wrap
              }}
            >
              {/* No links here */}
            </Breadcrumbs>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Search Bar for Mobile */}
          {isMobile && (
            <SearchBar>
              <FaSearch
                style={{ color: "white", marginRight: "8px" }} // Ensure icon is white
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
          )}

          {!isMobile && (
            <>
              <SearchBar>
                <FaSearch
                  style={{ color: "white", marginRight: "8px" }} // Ensure icon is white
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
                endIcon={<FaChevronDown style={{ color: "white" }} />} // Ensure icon is white
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

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span
                  style={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "700",
                  }}
                >
                  Need API Access?
                </span>
                <FaTelegram style={{ color: "white" }} />{" "}
                {/* Ensure icon is white */}
              </Box>
            </>
          )}
        </Box>
      </NavContainer>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: 300,
            backgroundColor: "#19202F",
            p: 2,
          },
        }}
      >
        {/* Mobile Menu Content */}
        <Box sx={{ p: 2 }}>
          <SearchBar sx={{ display: "block", width: "100%", mb: 2 }} />
          <Button
            fullWidth
            onClick={handleClick}
            endIcon={<FaChevronDown style={{ color: "white" }} />} // Ensure icon is white
            sx={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              mb: 2,
            }}
          >
            Top {selectedRange}
          </Button>
          {/* Add more mobile menu items */}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
