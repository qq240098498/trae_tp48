/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    extend: {
      // 自定义颜色系统
      colors: {
        // 主色调：深邃靛蓝
        primary: {
          50: "#E8EEF7",
          100: "#D1DDF0",
          200: "#A3BCE1",
          300: "#759AD2",
          400: "#4778C3",
          500: "#1E3A5F",
          600: "#1A3352",
          700: "#15283F",
          800: "#0F1E2D",
          900: "#081018",
        },
        // 辅助色：活力橙
        accent: {
          50: "#FFF0E8",
          100: "#FFE0D1",
          200: "#FFC1A3",
          300: "#FFA275",
          400: "#FF8347",
          500: "#FF6B35",
          600: "#E05A2B",
          700: "#B84922",
          800: "#8F391A",
          900: "#602611",
        },
        // 点缀色：薄荷绿
        success: {
          50: "#E6F8F6",
          100: "#CFF1ED",
          200: "#9FE3DB",
          300: "#6FD5C9",
          400: "#3FC7B7",
          500: "#2EC4B6",
          600: "#259D92",
          700: "#1D7A72",
          800: "#155751",
          900: "#0D3834",
        },
        // 背景色：雾灰
        background: {
          50: "#FAFBFD",
          100: "#F5F7FA",
          200: "#E6EBF2",
          300: "#D7DFE9",
          400: "#C8D3E0",
          500: "#B9C7D7",
          600: "#9AA3B3",
          700: "#7A808E",
          800: "#5B5F6A",
          900: "#3C3F47",
        },
      },
      // 自定义字体
      fontFamily: {
        // 标题字体
        "serif-sc": ["'Noto Serif SC'", "Georgia", "serif"],
        // 正文字体
        "sans-sc": ["'Noto Sans SC'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      // 自定义动画
      animation: {
        // 渐入动画
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        // 滑入动画
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        // 缩放动画
        "scale-in": "scaleIn 0.3s ease-out",
        // 脉冲动画（较慢版本）
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // 浮动动画
        float: "float 3s ease-in-out infinite",
        // 渐变背景动画
        "gradient-shift": "gradientShift 8s ease infinite",
        // 旋转动画（慢速）
        "spin-slow": "spin 8s linear infinite",
      },
      // 自定义关键帧
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      // 自定义过渡效果
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "ease-in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      // 自定义阴影
      boxShadow: {
        // 卡片阴影
        "card": "0 4px 6px -1px rgba(30, 58, 95, 0.08), 0 2px 4px -2px rgba(30, 58, 95, 0.06)",
        "card-hover": "0 10px 15px -3px rgba(30, 58, 95, 0.12), 0 4px 6px -4px rgba(30, 58, 95, 0.08)",
        "card-lg": "0 20px 25px -5px rgba(30, 58, 95, 0.12), 0 8px 10px -6px rgba(30, 58, 95, 0.1)",
        // 主色调阴影
        "primary": "0 4px 14px 0 rgba(30, 58, 95, 0.25)",
        "accent": "0 4px 14px 0 rgba(255, 107, 53, 0.35)",
        "success": "0 4px 14px 0 rgba(46, 196, 182, 0.35)",
        // 内阴影
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)",
      },
      // 自定义圆角
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      // 自定义间距
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      // 背景大小
      backgroundSize: {
        "size-200": "200% 200%",
      },
    },
  },
  plugins: [],
};
