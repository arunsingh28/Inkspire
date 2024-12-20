import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Flex, Button } from "antd";

import { appRoutes } from "@/utils/paths";

import {
  useAuthState,
  useAuthDispatch,
  AuthActions,
} from "@/provider/auth.contex";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuthState();
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logoutFn = () => {
    dispatch({
      type: AuthActions.logout,
    });
    navigate(`/`);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to={`${appRoutes.dashboard.INDEX}`}
              className="text-2xl font-bold text-blue-600"
            >
              Inkspire
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-grow ml-10">
            <div className="flex-grow max-w-md"/>
              
           
            <div className="flex items-center space-x-4 ml-6">
              <Link to={`/${appRoutes.dashboard.NEW_BLOG}`}>
                <Button type="primary">New Post</Button>
              </Link>
              {Object.keys(user).length ? (
                <Flex
                  align="center"
                  gap="small"
                  className="rounded-md px-2 py-1"
                >
                  <img
                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                    alt="Profile"
                    className="w-7 h-7 rounded-full border-2 border-blue-600"
                  />
                  <p className="text-gray-700 font-poppins-regular text-sm">
                    {user.name}
                  </p>
                  <Button type="dashed" className="ml-3" onClick={logoutFn}>
                    Logout
                  </Button>
                </Flex>
              ) : (
                <Link to={`/auth/login`}>
                  <Button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
              />
              <Link
                to={`/${appRoutes.dashboard.NEW_BLOG}`}
                className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center mb-2"
              >
                New Post
              </Link>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
