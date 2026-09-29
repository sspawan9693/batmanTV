import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
    label,
    name,
    value,
    show,
    toggle,
    onChange,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm text-zinc-300">
                {label}
            </label>

            <div className="relative">

                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={show ? "text" : "password"}
                    className="
                        w-full
                        rounded-xl
                        border
                        border-zinc-700
                        bg-[#181818]
                        px-4
                        py-3
                        pr-12
                        outline-none
                        transition
                        focus:border-red-600
                    "
                />

                <button
                    type="button"
                    onClick={toggle}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-zinc-400
                        hover:text-white
                    "
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

            </div>

        </div>
    );
}

export default PasswordInput;