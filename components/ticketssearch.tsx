import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@react-types/datepicker";
import {
  Checkbox,
  CheckboxGroup,
  DateRangePicker,
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";

type FormData = {
  job_data: { $in: string };
  number_ele_esc: string;
  ele_esc: string;
  priority: string;
  assigned_to: { $in: string };
  ticket_date?: { $gte: Date; $lte: Date };
};

const TicketsSearchComponent = ({ clients, technicians, setQuery }: any) => {
  const [error, setError] = useState<string | undefined>();
  const [date, setDate] = useState<RangeValue<DateValue> | undefined>(
    undefined
  );
  const [jobDataValue, setJobDataValue] = useState(new Set<string>());
  const [userValue, setUserValue] = useState(new Set<string>());
  const [eleEscValue, setEleEscValue] = useState(new Set<string>());

  const [isDateActive, setIsDateActive] = useState(false);
  const [isJobNumberActive, setIsJobNumberActive] = useState(false);
  const [isUserActive, setIsUserActive] = useState(false);
  const [isEleEscActive, setIsEleEscActive] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    reset,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      job_data: { $in: "" },
      number_ele_esc: "",
      ele_esc: "",
      priority: "",
      assigned_to: { $in: "" },
      ticket_date: undefined,
    },
  });

  const formatDateForMongo = (date: DateValue | undefined) => {
    return date ? new Date(date.toString()) : null;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const filteredData = {
        ...Object.fromEntries(
          Object.entries(data).filter(([key, value]: any) => {
            if (key === "job_data" && value.$in === "") {
              return false;
            }
            if (key === "assigned_to" && value.$in === "") {
              return false;
            }
            if (key === "ticket_date" && value === undefined) {
              return false;
            }
            return value !== "";
          })
        ),
      };
      const formattedStartDate = formatDateForMongo(date?.start);
      const formattedEndDate = formatDateForMongo(date?.end);
      if (isDateActive && formattedStartDate && formattedEndDate) {
        filteredData.ticket_date = {
          $gte: formattedStartDate,
          $lte: formattedEndDate,
        };
      }
      if (Object.keys(filteredData).length === 0) {
        setError("Debes indicar una opcion");
        return;
      }
      console.log(filteredData);

      setQuery(filteredData);
      setIsDateActive(false);
      setIsUserActive(false);
      setIsJobNumberActive(false);
      reset();
    } catch (error: any) {
      if (error) {
        setError(error.response?.data?.error || "Error Desconocido");
      } else {
        setError("Error Desconocido");
      }
    }
  });

  const handlePriorityChange = (value: string) => {
    const currentPriority = watch("priority");
    setValue("priority", currentPriority === value ? "" : value);
    clearErrors("priority");
  };

  return (
    <div className="justify-center flex items-center">
      <Card className="bg-neutral-950 px-8">
        <CardBody>
          <CheckboxGroup label="Búsqueda:">
            {error && (
              <div className="bg-red-500 text-white p-2 mb-2">{error}</div>
            )}
            <Checkbox
              color="warning"
              value="isJobNumberActive"
              isSelected={isJobNumberActive}
              onValueChange={setIsJobNumberActive}
            >
              Por Número de Obra
            </Checkbox>
            <Checkbox
              color="warning"
              value="isUserActive"
              isSelected={isUserActive}
              onValueChange={setIsUserActive}
            >
              Por Usuario
            </Checkbox>
            <Checkbox
              color="warning"
              value="isEleEscActive"
              isSelected={isEleEscActive}
              onValueChange={setIsEleEscActive}
            >
              Por Equipo (Ascensor/Escalera)
            </Checkbox>
            <Checkbox
              color="warning"
              value="isDateActive"
              isSelected={isDateActive}
              onValueChange={setIsDateActive}
            >
              Por Fecha
            </Checkbox>
            <div className="flex gap-4 mb-2">
              <Checkbox
                color="warning"
                value="genteencerrada"
                isSelected={watch("priority") === "Gente Encerrada"}
                onChange={() => handlePriorityChange("Gente Encerrada")}
              >
                Gente Encerrada
              </Checkbox>
              <Checkbox
                color="danger"
                value="accidente"
                isSelected={watch("priority") === "Accidente"}
                onChange={() => handlePriorityChange("Accidente")}
              >
                Accidente
              </Checkbox>
            </div>
          </CheckboxGroup>
          <form onSubmit={onSubmit} className="flex flex-col items-center">
            {isJobNumberActive && (
              <Controller
                name="job_data.$in"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Número de obra"
                    placeholder="Seleccione"
                    selectionMode="single"
                    className="max-w-xs mb-2"
                    items={clients}
                    selectedKeys={jobDataValue}
                    onSelectionChange={(keys) => {
                      const selectedJobNumber = Array.from(
                        keys as Set<string>
                      )[0];
                      setJobDataValue(new Set([selectedJobNumber]));
                      field.onChange(selectedJobNumber);
                    }}
                    errorMessage={errors?.job_data?.message}
                    isInvalid={!!errors.job_data?.message}
                  >
                    {(job: any) => (
                      <SelectItem key={job._id} value={job._id}>
                        {`${job.job_number} - ${job.job_name}`}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
            )}

            {isUserActive && (
              <Controller
                name="assigned_to.$in"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Técnico"
                    placeholder="Seleccione"
                    selectionMode="single"
                    className="max-w-xs mb-2"
                    items={technicians}
                    selectedKeys={userValue}
                    onSelectionChange={(keys) => {
                      const selectedTech = Array.from(keys as Set<string>)[0];
                      setUserValue(new Set([selectedTech]));
                      field.onChange(selectedTech);
                    }}
                    errorMessage={errors?.assigned_to?.message}
                    isInvalid={!!errors.assigned_to?.message}
                  >
                    {(technician: any) => (
                      <SelectItem key={technician._id} value={technician._id}>
                        {`${technician.first_name} ${technician.last_name}`}
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
            )}
            {isEleEscActive && (
              <>
                <Input
                  type="text"
                  label="Número de equipo"
                  placeholder="Número..."
                  className="max-w-xs mb-2"
                  {...register("number_ele_esc")}
                  errorMessage={errors?.number_ele_esc?.message}
                  isInvalid={!!errors.number_ele_esc?.message}
                />
                <Controller
                  name="ele_esc"
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="Ascensor/Escalera"
                      label="Tipo"
                      selectionMode="single"
                      className="max-w-xs mb-2"
                      selectedKeys={eleEscValue}
                      onSelectionChange={(keys) => {
                        const selectedValue = Array.from(
                          keys as Set<string>
                        )[0];
                        setEleEscValue(new Set([selectedValue]));
                        field.onChange(selectedValue);
                      }}
                      errorMessage={errors?.ele_esc?.message}
                      isInvalid={!!errors.ele_esc?.message}
                    >
                      <SelectItem key="Ascensor">Ascensor</SelectItem>
                      <SelectItem key="Escalera">Escalera</SelectItem>
                    </Select>
                  )}
                />
              </>
            )}
            {isDateActive && (
              <DateRangePicker
                label="Rango de fecha"
                className="max-w-xs"
                value={date}
                onChange={setDate}
              />
            )}
            <Button
              type="submit"
              color="success"
              className="mb-2 mt-2 text-white"
              variant="shadow"
            >
              Buscar
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default TicketsSearchComponent;
