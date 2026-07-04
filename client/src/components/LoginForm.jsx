import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import LoginLeftSide from "./LoginLeftSide";
import { Link } from "react-router-dom";
import { useState } from "react";


const LoginForm = ({role,title,subtitle}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      <LoginLeftSide />

      <div className="flex-1 flex items-start justify-center pt-30 px-8 bg-white">


      <div className="w-full max-w-lg animate-fade-in">

        <Link to='/login' className='inline-flex items-center gap-2 text-slate-400
        hover:text-slate-700 text-sm mb-10 transition-colors'>
          <ArrowLeftIcon size={16} /> Back to portals
        </Link> 

        <div>
          <h1 className="text-2xl py-1 sm:text-3xl font-medium text-zinc-800">
            {title}</h1>

          <p className="text-slate-500 py-2 text-sm sm:text-base mt-2">
            {subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200
          text-rose-700 text-sm rounded-xl flex items-start gap-3">

          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />

            {error}
          </div>
        )}

        {/* Form Section */}
        <form className="space-y-5 " onSubmit={handleSubmit}>

          {/* Email Section*/}
          <div>
            <label className="block text-sm py-2 font-medium text-slate-700
            mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
            required placeholder="john@example.com" className="w-full px-4 py-3 bg-white border border-[#0fb7a3] rounded-lg
             hover:border-[#0ddbc3]
             focus:outline-none
             focus:ring-0
             hover:bg-[#dbf0ed]
            "/> 
          </div>

          {/* Password Section*/}
          <div>
            <label className="block text-sm font-medium text-slate-700
            mb-2">Password</label>

            <div className="relative">

            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)}
            required  placeholder="........" className="w-full px-4 py-3 bg-white border border-[#0fb7a3] rounded-lg
             hover:border-[#0ddbc3]
             focus:outline-none
             focus:ring-0
             hover:bg-[#dbf0ed]
            " /> 
          
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2
            text-slate-400 hover:text-slate-600 transition-colors" 
            onClick={()=>setshowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon size={18} />
              :<EyeIcon size={18}/>}

            </button>

            </div>



          </div>

          {/*Sign In button*/}

          <button type="submit"
          disabled={loading}
          className="w-full py-3 bg-linear-to-r from-[#0A7C6E] to-[#0edac2]
          text-white rounded-md text-sm font-semibold hover:from-[#176058]
          hover:to-[#06ad9a] disabled:opacity-50 transition-all duration-200
          shadow-lg shadow-indigo-500/25 active:Scale-[0.98] flex items-center
          justify-center">

            {loading && <Loader2Icon 
            className="animate-spin h-4 w-4 mr-2"/>}

            Sign in

          </button>

        </form>


      </div>

       </div>

    </div>
  )
}

export default LoginForm