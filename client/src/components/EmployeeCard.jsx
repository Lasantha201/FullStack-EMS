import React from 'react';
import { PencilIcon, Trash2Icon } from 'lucide-react';


const EmployeeCard = ({employee, onDelete, onEdit}) => {

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    onDelete?.(employee.id);
};

  return (
    <div className='group relative card card-hover overflow-hidden'>

        <div className='relative aspect-4/3 w-full overflow-hidden
        bg-linear-to-br from-slate-100 to-slate-50'>
            
            <div className='w-full h-full flex items-center justify-center'>

                {/*Circle icons */}
                <div className='w-20 h-20 rounded-full bg-linear-to-br
                from-[#dafcf7] to-[#e1f6f3] flex items-center
                justify-center'>
                    <span className='text-2xl font-medium text-[#0A7C6E]'>
                        {employee.firstName[0]} {employee.lastName[0]}
                    </span>
                </div>
                
            </div>
        </div>

        <div className="absolute top-3 left-3 flex gap-2">

  <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-slate-600 rounded-lg shadow-sm">
    {employee.department || "Remote"}
  </span>

  {employee.isDeleted && (
    <span className="bg-red-500 text-white px-2.5 py-1 text-xs font-medium rounded-lg">
      DELETED
    </span>
  )}

</div>

  {!employee.isDeleted && (
    <div className='absolute inset-0 bg-linear-to-t from-[#0A7C6E]/20
    via-transparent to-transparent opacity-0 group-hover:opacity-100
    transition-opacity flex items-end justify-center pb-6 gap-3'>
      <button onClick={()=> onEdit(employee)} 
      className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700
      hover:text-[#0A7C6E] rounded-xl shadow-lg transition-all hover:scale-105 '>
        <PencilIcon className='w-4 h-4'/>
      </button>

      <button onClick={handleDelete} className='p-2.5 bg-white/90 backdrop-blur-sm text-slate-700
      hover:text-[#e81d1d] rounded-xl shadow-lg transition-all hover:scale-105'>
        <Trash2Icon className='w-4 h-4' />
      </button>
      </div>
  )}

        <div>
            <h3>
                {employee.firstName} {employee.lastName}
            </h3>
            <p className='text-xs text-slate-500'>{employee.position}</p>
        </div>

    </div>
  )
}

export default EmployeeCard