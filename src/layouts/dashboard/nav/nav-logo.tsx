import Logo from "@/components/logo";
import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import { ThemeLayout } from "#/enum";
import { HEADER_HEIGHT } from "../config";

const { VITE_TITLE: TITLE } = import.meta.env;

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};
export default function NavLogo({ collapsed, onToggle }: Props) {
  const { themeLayout } = useSettings();

  return (
    <div
      style={{ height: `${HEADER_HEIGHT}px` }}
      className="relative flex items-center justify-center py-4"
    >
      <div className="flex items-center">
        <Logo />
        {themeLayout !== ThemeLayout.Mini && (
          <NavLink to="/">
            <span className="ml-2 text-xl font-bold text-primary">{TITLE}</span>
          </NavLink>
        )}
      </div>
      <div
        onClick={onToggle}
        onKeyDown={onToggle}
        className={cn(
          "absolute right-0 top-7 z-50 hidden h-6 w-6 translate-x-1/2 cursor-pointer select-none items-center justify-center rounded-full text-center md:flex border border-dashed border-border text-sm bg-bg-paper"
        )}
      >
        {collapsed ? (
          <RightOutlined className="text-xs text-text-disabled" />
        ) : (
          <LeftOutlined className="text-xs text-text-disabled" />
        )}
      </div>
    </div>
  );
}
